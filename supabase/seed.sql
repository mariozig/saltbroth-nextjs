-- Insert sample categories
INSERT INTO public.categories (name, slug, description) VALUES
    ('Creative Writing', 'creative-writing', 'Prompts for creative writing and storytelling'),
    ('Business & Marketing', 'business-marketing', 'Professional content and marketing materials'),
    ('Visual Arts', 'visual-arts', 'Prompts for generating visual art descriptions'),
    ('Educational', 'educational', 'Educational content and learning materials'),
    ('Business', 'business', 'Professional content and business materials'),
    ('Writing', 'writing', 'Prompts for various types of writing'),
    ('Professional Content', 'professional-content', 'Business writing prompts focused on clarity and professionalism');

-- Insert nested level 2 categories
INSERT INTO public.categories (name, slug, description, parent_id) VALUES
    ('Business Writing', 'business/writing', 'Professional writing prompts', (SELECT id FROM public.categories WHERE slug = 'business')),
    ('Proposals', 'business/proposals', 'Business proposal templates', (SELECT id FROM public.categories WHERE slug = 'business')),
    ('Poems', 'writing/poems', 'Poetry writing prompts', (SELECT id FROM public.categories WHERE slug = 'writing')),
    ('Song Lyrics', 'writing/song-lyrics', 'Songwriting prompts', (SELECT id FROM public.categories WHERE slug = 'writing')),
    ('Professional Content', 'business/professional-content', 'Business writing prompts focused on clarity and professionalism', (SELECT id FROM public.categories WHERE slug = 'business'));

-- Insert nested level 3 categories
INSERT INTO public.categories (name, slug, description, parent_id) VALUES
    ('Email Templates', 'business/professional-content/email-templates', 'Professional email templates and prompts', 
     (SELECT id FROM public.categories WHERE slug = 'business/professional-content'));

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
INSERT INTO public.prompts (title, slug, description, content, user_id, category_id, is_premium, icon) VALUES
    (
        'Professional Email Template',
        'professional-email-template',
        'Create polished and effective professional emails for various business contexts',
        'Write a professional email about: {topic}. Tone should be {tone} and length should be {length}.',
        '00000000-0000-0000-0000-000000000000',
        (SELECT id FROM public.categories WHERE slug = 'business-marketing'),
        false,
        'fa-envelope'
    ),
    (
        'Creative Story Starter',
        'creative-story-starter',
        'Jump-start your creative writing with engaging story openings',
        'Write a creative story opening in the {genre} genre, featuring a character who is {character_trait}.',
        '00000000-0000-0000-0000-000000000000',
        (SELECT id FROM public.categories WHERE slug = 'creative-writing'),
        true,
        'fa-book'
    ),
    (
        'Business Email Template',
        'business-email-template',
        'Create professional business emails with appropriate tone and format',
        'Write a professional email about: {topic}. Tone should be {tone} and length should be {length}.',
        '00000000-0000-0000-0000-000000000000',
        (SELECT id FROM public.categories WHERE slug = 'business/writing'),
        false,
        'fa-envelope'
    ),
    (
        'Creative Poem Starter',
        'creative-poem-starter',
        'Generate poetry starters in various styles and themes',
        'Write a creative poem in the {style} style, featuring a theme of {theme}.',
        '00000000-0000-0000-0000-000000000000',
        (SELECT id FROM public.categories WHERE slug = 'writing/poems'),
        true,
        'fa-feather'
    ),
    (
        'Meeting Follow-Up Email Generator',
        'meeting-follow-up',
        'Create professional follow-up emails that capture key points and action items from your meetings',
        'Meeting Date: [Date]\nDuration: [Duration]\nLocation: [Location]\n\nAttendees:\n[List of attendees with their roles]\n\nKey Discussion Points:\n[List the main topics discussed]\n\nAction Items:\n[List specific tasks, who is responsible, and deadlines]\n\nNext Steps:\n[Outline the next steps and timeline]',
        '00000000-0000-0000-0000-000000000000',
        (SELECT id FROM public.categories WHERE slug = 'business/professional-content/email-templates'),
        false,
        'fa-file-lines'
    );

-- Add LLMs if not added by migration
INSERT INTO public.llms (name, color) VALUES
    ('ChatGPT', '#10a37f'),
    ('Claude', '#8e44ef'),
    ('Llama', '#4f46e5')
ON CONFLICT (name) DO NOTHING;

-- Insert sample output samples (formerly llm_outputs)
INSERT INTO public.output_samples (prompt_id, llm_id, content) VALUES
    (
        (SELECT id FROM public.prompts WHERE title = 'Professional Email Template'),
        (SELECT id FROM public.llms WHERE name = 'ChatGPT'),
        'Dear [Name],\n\nI hope this email finds you well...'
    ),
    -- ChatGPT output for Meeting Follow-Up
    (
        (SELECT id FROM public.prompts WHERE title = 'Meeting Follow-Up Email Generator'),
        (SELECT id FROM public.llms WHERE name = 'ChatGPT'),
        'Subject: Q1 Performance Review - Summary & Action Items\n\nDear Team,\n\nThank you for participating today Q1 review meeting. Here is a summary of our discussion:\n\nMeeting Details:\n- Date: March 1, 2024\n- Duration: 60 minutes\n- Location: Virtual Room A\n\nKey Points Discussed:\n1. Q1 Performance Review\n   - Sales exceeded targets by 15%\n   - Marketing campaign results\n   - Product roadmap updates\n\nAction Items:\n1. John (Sales): Q2 forecast due March 8\n2. Sarah (Marketing): Budget revision due March 5\n3. Mike (Product): Beta schedule due March 3\n\nNext Steps:\n- Weekly progress updates via email\n- Follow-up meeting: March 15, 10 AM EST\n\nBest regards,\n[Name]'
    ),
    -- Claude output for Meeting Follow-Up
    (
        (SELECT id FROM public.prompts WHERE title = 'Meeting Follow-Up Email Generator'),
        (SELECT id FROM public.llms WHERE name = 'Claude'),
        'Subject: Meeting Recap - Q1 Review & Next Steps\n\nHi team,\n\nQuick summary of our meeting today Q1 review meeting:\n\nMEETING DETAILS\nWhen: March 1, 2024, 10-11 AM EST\nWhere: Virtual Room A\n\nKEY POINTS\n• Q1 Sales: +15% above target\n• Marketing: Social campaign success\n• Product: Q2 roadmap confirmed\n\nACTION ITEMS\n→ John: Q2 sales projection (Due Mar 8)\n→ Sarah: Budget revision (Due Mar 5)\n→ Mike: Beta timeline (Due Mar 3)\n\nNEXT STEPS\n• Weekly updates start Monday\n• Next meeting: March 15 @ 10 AM\n\nQuestions? Just reply to this email.\n\nBest,\n[Name]'
    ),
    -- Llama output for Meeting Follow-Up
    (
        (SELECT id FROM public.prompts WHERE title = 'Meeting Follow-Up Email Generator'),
        (SELECT id FROM public.llms WHERE name = 'Llama'),
        'Subject: 📋 Q1 Review Meeting Summary\n\nTeam,\n\nHere is a recap of our Q1 review meeting:\n\n📅 Meeting Info\n• Date: March 1, 2024\n• Time: 60 min\n• Place: Virtual Room A\n\n💡 Key Topics\n1. Sales\n   * Q1: Exceeded by 15%\n   * New clients up 25%\n\n2. Marketing\n   * Social: +40% engagement\n   * Leads: +30% growth\n\n3. Product\n   * v2.0: Q2 launch on track\n   * Beta: Next week start\n\n✅ Action Items\n• John → Q2 forecast (Mar 8)\n• Sarah → Budget update (Mar 5)\n• Mike → Beta plan (Mar 3)\n\n📌 Next Up\n• Weekly email updates\n• Meet again: Mar 15, 10am\n\n-[Name]'
    );
