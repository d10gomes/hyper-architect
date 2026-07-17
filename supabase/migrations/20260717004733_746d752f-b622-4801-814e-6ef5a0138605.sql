-- Revoke Data API access from anon/authenticated; only service_role writes via server function
REVOKE ALL ON public.waitlist FROM anon, authenticated;
GRANT ALL ON public.waitlist TO service_role;

-- Add explicit deny policies so RLS is not "enabled without policies"
DROP POLICY IF EXISTS "No public read access to waitlist" ON public.waitlist;
CREATE POLICY "No public read access to waitlist"
  ON public.waitlist FOR SELECT
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "No public insert to waitlist" ON public.waitlist;
CREATE POLICY "No public insert to waitlist"
  ON public.waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

DROP POLICY IF EXISTS "No public update to waitlist" ON public.waitlist;
CREATE POLICY "No public update to waitlist"
  ON public.waitlist FOR UPDATE
  TO anon, authenticated
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "No public delete to waitlist" ON public.waitlist;
CREATE POLICY "No public delete to waitlist"
  ON public.waitlist FOR DELETE
  TO anon, authenticated
  USING (false);