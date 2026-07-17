CREATE TYPE public.plan_tier AS ENUM ('free', 'starter', 'pro', 'studio');

CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  plan public.plan_tier NOT NULL DEFAULT 'free',
  period_start timestamptz NOT NULL DEFAULT now(),
  renders_used int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.plan_limit(_plan public.plan_tier)
RETURNS int LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT CASE _plan
    WHEN 'free' THEN 3
    WHEN 'starter' THEN 30
    WHEN 'pro' THEN 150
    WHEN 'studio' THEN 500
  END
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.consume_render_credit(_user_id uuid)
RETURNS TABLE (allowed boolean, remaining int, plan public.plan_tier, period_end timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  p public.profiles;
  lim int;
BEGIN
  SELECT * INTO p FROM public.profiles WHERE user_id = _user_id FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.profiles (user_id) VALUES (_user_id)
    RETURNING * INTO p;
  END IF;

  IF p.period_start + interval '30 days' <= now() THEN
    UPDATE public.profiles
      SET period_start = now(), renders_used = 0, updated_at = now()
      WHERE user_id = _user_id
      RETURNING * INTO p;
  END IF;

  lim := public.plan_limit(p.plan);
  IF p.renders_used >= lim THEN
    RETURN QUERY SELECT false, 0, p.plan, p.period_start + interval '30 days';
    RETURN;
  END IF;

  UPDATE public.profiles
    SET renders_used = renders_used + 1, updated_at = now()
    WHERE user_id = _user_id
    RETURNING * INTO p;

  RETURN QUERY SELECT true, lim - p.renders_used, p.plan, p.period_start + interval '30 days';
END;
$$;

CREATE OR REPLACE FUNCTION public.my_quota()
RETURNS TABLE (plan public.plan_tier, used int, remaining int, "limit" int, period_end timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  p public.profiles;
  lim int;
BEGIN
  SELECT * INTO p FROM public.profiles WHERE user_id = auth.uid();
  IF NOT FOUND THEN
    lim := public.plan_limit('free');
    RETURN QUERY SELECT 'free'::public.plan_tier, 0, lim, lim, now() + interval '30 days';
    RETURN;
  END IF;

  IF p.period_start + interval '30 days' <= now() THEN
    lim := public.plan_limit(p.plan);
    RETURN QUERY SELECT p.plan, 0, lim, lim, now() + interval '30 days';
    RETURN;
  END IF;

  lim := public.plan_limit(p.plan);
  RETURN QUERY SELECT p.plan, p.renders_used, GREATEST(lim - p.renders_used, 0), lim, p.period_start + interval '30 days';
END;
$$;

GRANT EXECUTE ON FUNCTION public.my_quota() TO authenticated;