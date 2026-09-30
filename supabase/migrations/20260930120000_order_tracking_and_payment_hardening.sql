-- Order tracking, payment confirmation fields, and security fixes.

-- 1. New order fields
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS tracking_token UUID NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS amount_paid INTEGER,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS yoco_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_mode TEXT,
  ADD COLUMN IF NOT EXISTS courier_tracking TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'online';

CREATE UNIQUE INDEX IF NOT EXISTS orders_tracking_token_key ON public.orders (tracking_token);
CREATE INDEX IF NOT EXISTS orders_yoco_checkout_id_idx ON public.orders (yoco_checkout_id);

-- 2. "Ready for collection" status for store pickups
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending','paid','processing','ready_for_pickup','dispatched','delivered','cancelled','failed'));

-- 3. Orders are now created only by the create-order edge function (service role),
--    which recomputes the total. Browsers can no longer write orders directly.
DROP POLICY IF EXISTS "Allow public order creation" ON public.orders;

-- 4. Private settings (Yoco webhook signing secret). RLS on, no policies:
--    only the service role used by edge functions can read or write it.
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- 5. Stop "first signup becomes admin". Anyone could sign up at /login and get
--    access to every customer's details. Admins are now granted explicitly:
--    INSERT INTO public.user_roles (user_id, role)
--    SELECT id, 'admin' FROM auth.users WHERE email = '<email>';
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email) VALUES (NEW.id, NEW.email)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$function$;
