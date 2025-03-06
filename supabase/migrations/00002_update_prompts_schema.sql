-- Modify prompts table to add necessary fields
ALTER TABLE public.prompts 
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS icon TEXT;

-- Update existing prompts to have slugs (one-time migration)
UPDATE public.prompts 
SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]', '-', 'g'))
WHERE slug IS NULL;

-- Make slug NOT NULL after filling existing data
ALTER TABLE public.prompts 
  ALTER COLUMN slug SET NOT NULL;

-- Create llms table
CREATE TABLE IF NOT EXISTS public.llms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create trigger for llms updated_at
CREATE TRIGGER update_llms_updated_at
  BEFORE UPDATE ON public.llms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on llms table
ALTER TABLE public.llms ENABLE ROW LEVEL SECURITY;

-- Create policy for llms
CREATE POLICY "Anyone can read llms" ON public.llms
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify llms" ON public.llms
  USING (EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  ));

-- Rename and modify llm_outputs table to match our new structure
ALTER TABLE public.llm_outputs RENAME TO output_samples;

-- Drop the model_name column to replace with llm_id
ALTER TABLE public.output_samples DROP COLUMN model_name;

-- Add llm_id and updated_at to output_samples
ALTER TABLE public.output_samples 
  ADD COLUMN llm_id UUID REFERENCES public.llms(id) ON DELETE CASCADE,
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Create trigger for output_samples updated_at
CREATE TRIGGER update_output_samples_updated_at
  BEFORE UPDATE ON public.output_samples
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Rename output_text to content for consistency
ALTER TABLE public.output_samples RENAME COLUMN output_text TO content;

-- Insert initial LLM data
INSERT INTO public.llms (name, color) VALUES
  ('ChatGPT', '#10a37f'),
  ('Claude', '#8e44ef'),
  ('Llama', '#4f46e5')
ON CONFLICT (name) DO UPDATE
  SET color = EXCLUDED.color;
