-- Create an enum type for subscription tiers if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.subscription_tier AS ENUM ('FREE', 'PRO', 'PREMIUM');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Function to check subscription limits
CREATE OR REPLACE FUNCTION public.check_subscription_limits()
 RETURNS trigger
 LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_tier public.subscription_tier;
  tier_max_books integer;
  tier_max_pages integer;
  current_book_count integer;
  current_page_count integer;
BEGIN
  -- Get user's subscription tier from profiles table
  SELECT tier INTO user_tier
  FROM public.rules r
  WHERE r.tier = (SELECT subscription_tier FROM public.profiles WHERE id = auth.uid());

  -- Get tier limits
  SELECT max_books, max_pages INTO tier_max_books, tier_max_pages
  FROM public.rules
  WHERE tier = user_tier;

  -- Get current counts
  SELECT COUNT(*) INTO current_book_count
  FROM public.books
  WHERE user_id = auth.uid();

  -- For pages, we need to check the count within the specific book
  IF TG_TABLE_NAME = 'pages' AND TG_OP = 'INSERT' THEN
    SELECT COUNT(*) INTO current_page_count
    FROM public.pages
    WHERE book_id = NEW.book_id;
  END IF;

  -- Check book limit
  IF TG_TABLE_NAME = 'books' AND TG_OP = 'INSERT' THEN
    IF tier_max_books IS NOT NULL AND current_book_count >= tier_max_books THEN
      RAISE EXCEPTION 'You have reached the maximum number of books (%) allowed for your % subscription tier.',
        tier_max_books, user_tier;
    END IF;
  END IF;

  -- Check page limit per book
  IF TG_TABLE_NAME = 'pages' AND TG_OP = 'INSERT' THEN
    IF tier_max_pages IS NOT NULL AND current_page_count >= tier_max_pages THEN
      RAISE EXCEPTION 'You have reached the maximum number of pages (%) allowed per book for your % subscription tier.',
        tier_max_pages, user_tier;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Create triggers for books and pages tables
DROP TRIGGER IF EXISTS check_book_limits ON public.books;
CREATE TRIGGER check_book_limits
  BEFORE INSERT ON public.books
  FOR EACH ROW
  EXECUTE FUNCTION public.check_subscription_limits();

DROP TRIGGER IF EXISTS check_page_limits ON public.pages;
CREATE TRIGGER check_page_limits
  BEFORE INSERT ON public.pages
  FOR EACH ROW
  EXECUTE FUNCTION public.check_subscription_limits();