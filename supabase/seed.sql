-- Insert sample categories
INSERT INTO public.categories (name, slug, description) VALUES
    ('Creative Writing', 'creative-writing', 'Prompts for creative writing and storytelling'),
    ('Business & Marketing', 'business-marketing', 'Professional content and marketing materials'),
    ('Visual Arts', 'visual-arts', 'Prompts for generating visual art descriptions'),
    ('Educational', 'educational', 'Educational content and learning materials');

-- Insert sample admin user (make sure to replace with actual admin email)
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'admin@example.com',
    crypt('adminpassword', gen_salt('bf')),
    NOW(),
    '{"name": "Admin User", "role": "admin", "is_verified": true}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- The handle_new_user trigger will automatically create the public.users record

-- Insert sample prompts
INSERT INTO public.prompts (title, content, user_id, category_id, is_premium) VALUES
    (
        'Professional Email Template',
        'Write a professional email about: {topic}. Tone should be {tone} and length should be {length}.',
        '00000000-0000-0000-0000-000000000000',
        (SELECT id FROM public.categories WHERE slug = 'business-marketing'),
        false
    ),
    (
        'Creative Story Starter',
        'Write a creative story opening in the {genre} genre, featuring a character who is {character_trait}.',
        '00000000-0000-0000-0000-000000000000',
        (SELECT id FROM public.categories WHERE slug = 'creative-writing'),
        true
    );

-- Insert sample LLM outputs
INSERT INTO public.llm_outputs (prompt_id, model_name, output_text) VALUES
    (
        (SELECT id FROM public.prompts WHERE title = 'Professional Email Template'),
        'GPT-4',
        'Dear [Name],\n\nI hope this email finds you well...'
    );
