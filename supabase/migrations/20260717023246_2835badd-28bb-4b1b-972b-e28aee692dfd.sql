REVOKE EXECUTE ON FUNCTION public.consume_render_credit(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.plan_limit(public.plan_tier) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.my_quota() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_quota() TO authenticated;