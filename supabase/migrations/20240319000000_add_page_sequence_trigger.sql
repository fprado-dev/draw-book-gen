-- Create a function to automatically set the sequence number for new pages
CREATE OR REPLACE FUNCTION public.set_page_sequence_number()
RETURNS trigger AS $$
BEGIN
    -- If sequence_number is not provided, append to the end
    IF NEW.sequence_number IS NULL THEN
        SELECT COALESCE(MAX(sequence_number), 0) + 1
        INTO NEW.sequence_number
        FROM public.pages
        WHERE book_id = NEW.book_id;
    END IF;

    -- If inserting at an existing position, shift subsequent pages up
    UPDATE public.pages
    SET sequence_number = sequence_number + 1
    WHERE book_id = NEW.book_id
    AND sequence_number >= NEW.sequence_number;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically set sequence number before insert
CREATE TRIGGER set_page_sequence_number_trigger
    BEFORE INSERT ON public.pages
    FOR EACH ROW
    EXECUTE FUNCTION public.set_page_sequence_number();