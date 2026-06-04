
-- Roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Auto-create profile + assign role on signup (first user = admin)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  user_count INT;
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));

  SELECT COUNT(*) INTO user_count FROM auth.users;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Bots
CREATE TABLE public.bots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  strategy TEXT NOT NULL,
  price_usd NUMERIC(10,2) NOT NULL,
  win_rate NUMERIC(5,2) NOT NULL,
  risk_level TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.bots TO anon, authenticated;
GRANT ALL ON public.bots TO service_role;
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone read bots" ON public.bots FOR SELECT USING (true);
CREATE POLICY "admins manage bots" ON public.bots FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Course tiers
CREATE TABLE public.course_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level TEXT NOT NULL,
  description TEXT NOT NULL,
  price_usd NUMERIC(10,2) NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.course_tiers TO anon, authenticated;
GRANT ALL ON public.course_tiers TO service_role;
ALTER TABLE public.course_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone read courses" ON public.course_tiers FOR SELECT USING (true);
CREATE POLICY "admins manage courses" ON public.course_tiers FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Purchases / payment verifications
CREATE TYPE public.purchase_status AS ENUM ('pending','approved','rejected');
CREATE TYPE public.item_type AS ENUM ('bot','course');

CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type public.item_type NOT NULL,
  item_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  amount_usd NUMERIC(10,2) NOT NULL,
  mpesa_code TEXT NOT NULL,
  status public.purchase_status NOT NULL DEFAULT 'pending',
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);
GRANT SELECT, INSERT ON public.purchases TO authenticated;
GRANT UPDATE ON public.purchases TO authenticated;
GRANT ALL ON public.purchases TO service_role;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own purchases" ON public.purchases FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "users create own purchases" ON public.purchases FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins update purchases" ON public.purchases FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Seed 15 bots
INSERT INTO public.bots (name, description, strategy, price_usd, win_rate, risk_level) VALUES
('Apex Scalper X1','High-frequency scalping bot optimized for EUR/USD micro-movements.','Scalping',59.00,72.50,'Medium'),
('Golden Trend Hunter','Rides medium-term trends on XAU/USD with adaptive stops.','Trend Following',129.00,68.40,'Medium'),
('Neon Grid Pro','Grid trading bot for ranging markets with smart martingale caps.','Grid',89.00,74.20,'High'),
('Volatility Reaper','News-event volatility breakout bot for major pairs.','Breakout',149.00,65.10,'High'),
('Quantum Swing','Swing trader powered by multi-timeframe RSI confluence.','Swing',99.00,70.80,'Low'),
('Phantom Arbitrage','Cross-broker triangular arbitrage scanner & executor.','Arbitrage',139.00,82.30,'Low'),
('Stealth Sniper','Precision entries on London open with tight stops.','Session Breakout',79.00,69.50,'Medium'),
('Tsunami Wave Rider','Elliott Wave + Fibonacci automated execution.','Wave Analysis',119.00,66.70,'Medium'),
('Iron Bull','Conservative trend bot tuned for slow-and-steady gains.','Trend Following',69.00,71.20,'Low'),
('Crypto Edge AI','BTC/ETH momentum bot with sentiment overlay.','Momentum',109.00,67.90,'High'),
('Silver Surfer','Mean-reversion bot for XAG/USD.','Mean Reversion',89.00,73.10,'Medium'),
('Hyper Pip Engine','Aggressive pip-hunter for index CFDs.','Scalping',75.00,68.00,'High'),
('Zen Range Master','Bollinger Band reversal bot for sideways markets.','Range Trading',99.00,70.40,'Low'),
('Black Mamba','Aggressive overnight gap trader on US30 & NAS100.','Gap Trading',135.00,64.80,'High'),
('Diamond Hands EA','Long-term position trader on major Forex pairs.','Position Trading',149.00,76.50,'Low');

-- Seed 3 course tiers
INSERT INTO public.course_tiers (name, level, description, price_usd, features) VALUES
('Starter','Beginner','Forex foundations: charting, risk management, and your first profitable strategy.',99.00,
 '["20+ HD video lessons","Trading psychology workbook","Private Telegram community","Weekly market review"]'::jsonb),
('Professional','Intermediate','Deeper price action, smart money concepts, and a complete trading plan template.',249.00,
 '["60+ HD video lessons","Live weekly mentorship calls","SMC & ICT modules","1-on-1 strategy review","All Starter content"]'::jsonb),
('Elite Mastery','Advanced','Funded-trader path: prop firm challenges, advanced risk, and personal mentorship.',499.00,
 '["Full curriculum (120+ lessons)","Personal mentor (12 weeks)","Prop firm challenge playbook","Lifetime updates","Priority signals channel","All Professional content"]'::jsonb);
