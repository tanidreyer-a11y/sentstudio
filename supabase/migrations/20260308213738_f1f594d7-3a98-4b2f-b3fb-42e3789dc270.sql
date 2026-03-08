CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  customer_name text NOT NULL,
  items jsonb NOT NULL,
  total_amount integer NOT NULL,
  yoco_checkout_id text,
  status text NOT NULL DEFAULT 'pending',
  currency text NOT NULL DEFAULT 'ZAR'
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public order creation" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public order reads" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public order updates" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);
