DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
REVOKE INSERT ON public.waitlist FROM anon, authenticated;