

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."subscription_tier" AS ENUM (
    'FREE',
    'PRO',
    'PREMIUM'
);


ALTER TYPE "public"."subscription_tier" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_outlines_structure"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NOT (SELECT bool_and(
    jsonb_typeof(item->'description') = 'string'
    AND jsonb_typeof(item->'keywords') = 'array'
  ) FROM jsonb_array_elements(NEW.outlines) AS item) THEN
    RAISE EXCEPTION 'Invalid outlines structure';
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."validate_outlines_structure"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."books" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "size" "text" NOT NULL,
    "status" "text" DEFAULT 'draft'::"text",
    "book_type" "text" DEFAULT 'paperback'::"text" NOT NULL,
    "measurement_unit" "text" DEFAULT 'inches'::"text" NOT NULL,
    "paper_color" "text" DEFAULT 'white'::"text" NOT NULL,
    "last_viewed" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "books_book_type_check" CHECK (("book_type" = ANY (ARRAY['paperback'::"text", 'hardcover'::"text"]))),
    CONSTRAINT "books_measurement_unit_check" CHECK (("measurement_unit" = ANY (ARRAY['inches'::"text", 'millimeters'::"text"]))),
    CONSTRAINT "books_paper_color_check" CHECK (("paper_color" = ANY (ARRAY['white'::"text", 'cream'::"text"]))),
    CONSTRAINT "books_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'published'::"text", 'archived'::"text"]))),
    CONSTRAINT "size_check" CHECK (("size" = ANY (ARRAY['5x8'::"text", '5.25x8'::"text", '5.5x8.5'::"text", '6x9'::"text", '5.06x7.81'::"text", '6.14x9.21'::"text", '6.69x9.61'::"text", '7x10'::"text", '7.44x9.69'::"text", '7.5x9.25'::"text", '8x10'::"text", '8.5x11'::"text", '8.27x11.69'::"text", '8.25x6'::"text", '8.25x8.25'::"text", '8.5x8.5'::"text"])))
);


ALTER TABLE "public"."books" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."outlines" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "info" "jsonb" NOT NULL,
    "outlines" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "info_structure" CHECK ((("jsonb_typeof"("info") = 'object'::"text") AND ("jsonb_typeof"(("info" -> 'prompt'::"text")) = 'string'::"text") AND ("jsonb_typeof"(("info" -> 'keywords'::"text")) = 'array'::"text"))),
    CONSTRAINT "outlines_structure" CHECK ((("jsonb_typeof"("outlines") = 'array'::"text") AND ("jsonb_array_length"("outlines") > 0)))
);


ALTER TABLE "public"."outlines" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pages" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "book_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "sequence_number" integer NOT NULL,
    "image_url" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."pages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "plan" "public"."subscription_tier" DEFAULT 'FREE'::"public"."subscription_tier" NOT NULL,
    "stripe_costumer_id" "text",
    "credits" integer DEFAULT 150,
    "credits_usage" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."user_subscriptions" OWNER TO "postgres";


ALTER TABLE ONLY "public"."books"
    ADD CONSTRAINT "books_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."outlines"
    ADD CONSTRAINT "outlines_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pages"
    ADD CONSTRAINT "pages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_subscriptions"
    ADD CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_subscriptions"
    ADD CONSTRAINT "user_subscriptions_stripe_costumer_id_key" UNIQUE ("stripe_costumer_id");



CREATE INDEX "books_created_at_idx" ON "public"."books" USING "btree" ("created_at");



CREATE INDEX "books_user_id_idx" ON "public"."books" USING "btree" ("user_id");



CREATE INDEX "idx_outlines_user_id" ON "public"."outlines" USING "btree" ("user_id");



CREATE INDEX "pages_book_id_idx" ON "public"."pages" USING "btree" ("book_id");



CREATE INDEX "pages_sequence_number_idx" ON "public"."pages" USING "btree" ("sequence_number");



CREATE INDEX "pages_user_id_idx" ON "public"."pages" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "validate_outlines_structure_trigger" BEFORE INSERT OR UPDATE ON "public"."outlines" FOR EACH ROW EXECUTE FUNCTION "public"."validate_outlines_structure"();



ALTER TABLE ONLY "public"."books"
    ADD CONSTRAINT "books_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."outlines"
    ADD CONSTRAINT "outlines_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pages"
    ADD CONSTRAINT "pages_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pages"
    ADD CONSTRAINT "pages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_subscriptions"
    ADD CONSTRAINT "user_subscriptions_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");



CREATE POLICY "Users can create pages for their own books." ON "public"."pages" FOR INSERT WITH CHECK (("book_id" IN ( SELECT "books"."id"
   FROM "public"."books"
  WHERE ("books"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can create their own outlines" ON "public"."outlines" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own books" ON "public"."books" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own outlines" ON "public"."outlines" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can delete their own pages." ON "public"."pages" FOR DELETE USING (("book_id" IN ( SELECT "books"."id"
   FROM "public"."books"
  WHERE ("books"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can insert their own books" ON "public"."books" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own books" ON "public"."books" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own outlines" ON "public"."outlines" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own pages." ON "public"."pages" FOR UPDATE USING (("book_id" IN ( SELECT "books"."id"
   FROM "public"."books"
  WHERE ("books"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can view their own books" ON "public"."books" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own outlines" ON "public"."outlines" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own pages." ON "public"."pages" FOR SELECT USING (("book_id" IN ( SELECT "books"."id"
   FROM "public"."books"
  WHERE ("books"."user_id" = "auth"."uid"()))));



ALTER TABLE "public"."books" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."outlines" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_subscriptions" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."validate_outlines_structure"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_outlines_structure"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_outlines_structure"() TO "service_role";


















GRANT ALL ON TABLE "public"."books" TO "anon";
GRANT ALL ON TABLE "public"."books" TO "authenticated";
GRANT ALL ON TABLE "public"."books" TO "service_role";



GRANT ALL ON TABLE "public"."outlines" TO "anon";
GRANT ALL ON TABLE "public"."outlines" TO "authenticated";
GRANT ALL ON TABLE "public"."outlines" TO "service_role";



GRANT ALL ON TABLE "public"."pages" TO "anon";
GRANT ALL ON TABLE "public"."pages" TO "authenticated";
GRANT ALL ON TABLE "public"."pages" TO "service_role";



GRANT ALL ON TABLE "public"."user_subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."user_subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."user_subscriptions" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
