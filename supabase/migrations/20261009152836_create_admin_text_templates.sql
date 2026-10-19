/*
# Create editable text templates and first-admin access

1. New Tables
- `admin_users` stores the authenticated users allowed to edit the shared templates.
- `admin_users.user_id` identifies the account from Supabase Auth.
- `admin_users.created_at` records when administrative access was granted.
- `text_templates` stores the editable message templates used by the text generator.
- `text_templates.template_key` is the stable key used by the application.
- `text_templates.label` is the human-readable name shown in the admin screen.
- `text_templates.content` stores the message with its placeholders.
- `text_templates.updated_at` records the last save time.

2. Security
- Row-level security is enabled on both tables.
- Anyone can read text templates because the generator is a shared tool.
- Only users listed in `admin_users` can create, update, or delete templates.
- Administrative membership can only be read by the signed-in user for their own account.
- The first account created in Supabase Auth is automatically added as an administrator.

3. Important Notes
- Templates are shared across the application, so an administrator's changes affect future generated messages for everyone.
- No existing tables or user data are changed or removed.
*/

CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.text_templates (
  template_key text PRIMARY KEY,
  label text NOT NULL,
  content text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.text_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_read_own_access" ON public.admin_users;
CREATE POLICY "admins_read_own_access" ON public.admin_users
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "public_read_templates" ON public.text_templates;
CREATE POLICY "public_read_templates" ON public.text_templates
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "admins_insert_templates" ON public.text_templates;
CREATE POLICY "admins_insert_templates" ON public.text_templates
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "admins_update_templates" ON public.text_templates;
CREATE POLICY "admins_update_templates" ON public.text_templates
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "admins_delete_templates" ON public.text_templates;
CREATE POLICY "admins_delete_templates" ON public.text_templates
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.grant_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.admin_users) THEN
    INSERT INTO public.admin_users (user_id) VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.grant_first_admin() FROM PUBLIC;

DROP TRIGGER IF EXISTS grant_first_admin_after_signup ON auth.users;
CREATE TRIGGER grant_first_admin_after_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_first_admin();
