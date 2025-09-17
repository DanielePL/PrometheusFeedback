-- Prometheus Feedback Database Schema
-- Erstelle die Tabellen für das Feedback-System

-- Questions Tabelle (Feedback-Fragen)
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL DEFAULT 'rating',
  category VARCHAR(100),
  section VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_required BOOLEAN DEFAULT true,
  options JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback Sessions Tabelle (User-Sessions)
CREATE TABLE IF NOT EXISTS feedback_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255),
  session_data JSONB,
  status VARCHAR(50) DEFAULT 'started',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback Responses Tabelle (Antworten)
CREATE TABLE IF NOT EXISTS feedback_responses (
  id SERIAL PRIMARY KEY,
  session_id UUID REFERENCES feedback_sessions(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  response_value JSONB NOT NULL,
  rating INTEGER,
  text_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indizes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_feedback_sessions_status ON feedback_sessions(status);
CREATE INDEX IF NOT EXISTS idx_feedback_sessions_created_at ON feedback_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_responses_session_id ON feedback_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_feedback_responses_question_id ON feedback_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_is_active ON questions(is_active);

-- ===================================================
-- INTERNAL FEEDBACK SYSTEM TABLES
-- ===================================================

-- Team Members Tabelle (Interne Team-Mitglieder)
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'developer',
  department VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Internal Feedback Tabelle (Interne Bug-Reports/Screenshots)
CREATE TABLE IF NOT EXISTS internal_feedback (
  id SERIAL PRIMARY KEY,
  screen_name VARCHAR(255) NOT NULL,
  screen_id VARCHAR(100),
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('mobile', 'web')),
  category VARCHAR(50) NOT NULL DEFAULT 'bug',
  severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'fixed', 'verified', 'closed')),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  screenshot_url TEXT,
  screenshot_filename VARCHAR(255),
  browser_info JSONB,
  device_info JSONB,
  created_by UUID REFERENCES team_members(id),
  assigned_to UUID REFERENCES team_members(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Internal Feedback Comments Tabelle (Kommentare zu Bug-Reports)
CREATE TABLE IF NOT EXISTS internal_feedback_comments (
  id SERIAL PRIMARY KEY,
  feedback_id INTEGER REFERENCES internal_feedback(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  author_id UUID REFERENCES team_members(id),
  is_status_change BOOLEAN DEFAULT false,
  old_status VARCHAR(20),
  new_status VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Screen Templates Tabelle (Vordefinierte Screen-Namen für Autocomplete)
CREATE TABLE IF NOT EXISTS screen_templates (
  id SERIAL PRIMARY KEY,
  screen_name VARCHAR(255) NOT NULL,
  screen_id VARCHAR(100) UNIQUE,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('mobile', 'web')),
  section VARCHAR(100),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================
-- INTERNAL FEEDBACK INDIZES
-- ===================================================

CREATE INDEX IF NOT EXISTS idx_internal_feedback_platform ON internal_feedback(platform);
CREATE INDEX IF NOT EXISTS idx_internal_feedback_status ON internal_feedback(status);
CREATE INDEX IF NOT EXISTS idx_internal_feedback_severity ON internal_feedback(severity);
CREATE INDEX IF NOT EXISTS idx_internal_feedback_created_by ON internal_feedback(created_by);
CREATE INDEX IF NOT EXISTS idx_internal_feedback_assigned_to ON internal_feedback(assigned_to);
CREATE INDEX IF NOT EXISTS idx_internal_feedback_created_at ON internal_feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_internal_feedback_comments_feedback_id ON internal_feedback_comments(feedback_id);
CREATE INDEX IF NOT EXISTS idx_screen_templates_platform ON screen_templates(platform);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);

-- Updated_at Trigger erstellen
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger für updated_at Felder
DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;
CREATE TRIGGER update_questions_updated_at 
    BEFORE UPDATE ON questions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_feedback_sessions_updated_at ON feedback_sessions;
CREATE TRIGGER update_feedback_sessions_updated_at 
    BEFORE UPDATE ON feedback_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_internal_feedback_updated_at ON internal_feedback;
CREATE TRIGGER update_internal_feedback_updated_at 
    BEFORE UPDATE ON internal_feedback 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at 
    BEFORE UPDATE ON team_members 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ===================================================
-- BEISPIELDATEN
-- ===================================================

-- Beispiel-Fragen einfügen
INSERT INTO questions (question_text, question_type, category, section, order_index) VALUES
('How would you rate the overall user interface?', 'rating', 'UI/UX', 'General', 1),
('How satisfied are you with the app performance?', 'rating', 'Performance', 'Technical', 2),
('Would you recommend this app to others?', 'rating', 'General', 'Overall', 3),
('How easy is it to navigate the app?', 'rating', 'UI/UX', 'Navigation', 4),
('Rate the quality of training programs', 'rating', 'Content', 'Training', 5),
('How helpful are the coaching features?', 'rating', 'Features', 'Coaching', 6),
('Rate the accuracy of tracking features', 'rating', 'Features', 'Tracking', 7),
('Any additional feedback or suggestions?', 'text', 'General', 'Open', 8)
ON CONFLICT DO NOTHING;

-- Team Members einfügen
INSERT INTO team_members (email, name, role, department) VALUES
('danielepauli@gmail.com', 'Daniel Pauli', 'admin', 'Management'),
('joostensjoerd@hotmail.com', 'Joost Ens', 'admin', 'Development'),
('developer1@prometheus.app', 'Sarah Schmidt', 'frontend_developer', 'Development'),
('developer2@prometheus.app', 'Max Müller', 'backend_developer', 'Development'),
('designer@prometheus.app', 'Anna Weber', 'ui_designer', 'Design'),
('qa@prometheus.app', 'Tom Fischer', 'qa_tester', 'Quality Assurance')
ON CONFLICT (email) DO NOTHING;

-- Screen Templates einfügen (Beispiele für Mobile und Web)
INSERT INTO screen_templates (screen_name, screen_id, platform, section, description) VALUES
-- Mobile Screens
('Login Screen', 'mobile_login_001', 'mobile', 'Authentication', 'User login and registration'),
('Dashboard Home', 'mobile_dashboard_001', 'mobile', 'Main', 'Main dashboard overview'),
('Workout List', 'mobile_workout_list_001', 'mobile', 'Training', 'List of available workouts'),
('Exercise Detail', 'mobile_exercise_detail_001', 'mobile', 'Training', 'Individual exercise information'),
('Progress Charts', 'mobile_progress_001', 'mobile', 'Analytics', 'User progress visualization'),
('Settings Menu', 'mobile_settings_001', 'mobile', 'Settings', 'App configuration options'),
('Profile Page', 'mobile_profile_001', 'mobile', 'User', 'User profile and information'),
('Camera Scanner', 'mobile_camera_001', 'mobile', 'VBT', 'Barcode/QR code scanner'),

-- Web Screens  
('Coach Dashboard', 'web_coach_dashboard_001', 'web', 'Coaching', 'Main coaching interface'),
('Client Management', 'web_client_mgmt_001', 'web', 'Coaching', 'Manage coaching clients'),
('Workout Builder', 'web_workout_builder_001', 'web', 'Programming', 'Create custom workouts'),
('Analytics Dashboard', 'web_analytics_001', 'web', 'Analytics', 'Performance analytics'),
('Reports Generator', 'web_reports_001', 'web', 'Reports', 'Generate client reports'),
('Admin Panel', 'web_admin_001', 'web', 'Administration', 'System administration'),
('Settings Panel', 'web_settings_001', 'web', 'Settings', 'System configuration'),
('User Management', 'web_user_mgmt_001', 'web', 'Administration', 'Manage system users')
ON CONFLICT (screen_id) DO NOTHING;

-- ===================================================
-- RLS (Row Level Security) POLICIES
-- ===================================================

-- Customer Feedback Tables
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_responses ENABLE ROW LEVEL SECURITY;

-- Internal Feedback Tables
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_feedback_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE screen_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON questions;
DROP POLICY IF EXISTS "Sessions can be created by anyone" ON feedback_sessions;
DROP POLICY IF EXISTS "Sessions are viewable by owner" ON feedback_sessions;
DROP POLICY IF EXISTS "Sessions can be updated by owner" ON feedback_sessions;
DROP POLICY IF EXISTS "Responses can be created by anyone" ON feedback_responses;
DROP POLICY IF EXISTS "Responses are viewable by owner" ON feedback_responses;
DROP POLICY IF EXISTS "Admin can view all questions" ON questions;
DROP POLICY IF EXISTS "Admin can view all sessions" ON feedback_sessions;
DROP POLICY IF EXISTS "Admin can view all responses" ON feedback_responses;

-- Policies für öffentlichen Zugriff (anonym für Customer Feedback)
CREATE POLICY "Questions are viewable by everyone" ON questions FOR SELECT USING (is_active = true);
CREATE POLICY "Sessions can be created by anyone" ON feedback_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Sessions are viewable by owner" ON feedback_sessions FOR SELECT USING (true);
CREATE POLICY "Sessions can be updated by owner" ON feedback_sessions FOR UPDATE USING (true);
CREATE POLICY "Responses can be created by anyone" ON feedback_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Responses are viewable by owner" ON feedback_responses FOR SELECT USING (true);

-- Admin Policies (für Service Role Key - Customer Feedback)
CREATE POLICY "Admin can manage all questions" ON questions FOR ALL USING (true);
CREATE POLICY "Admin can manage all sessions" ON feedback_sessions FOR ALL USING (true);
CREATE POLICY "Admin can manage all responses" ON feedback_responses FOR ALL USING (true);

-- Internal Feedback Policies (nur für Team Members)
CREATE POLICY "Team members are viewable by authenticated users" ON team_members FOR SELECT USING (true);
CREATE POLICY "Admin can manage team members" ON team_members FOR ALL USING (true);

CREATE POLICY "Internal feedback viewable by team" ON internal_feedback FOR SELECT USING (true);
CREATE POLICY "Internal feedback creatable by team" ON internal_feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Internal feedback updatable by team" ON internal_feedback FOR UPDATE USING (true);
CREATE POLICY "Admin can manage internal feedback" ON internal_feedback FOR ALL USING (true);

CREATE POLICY "Comments viewable by team" ON internal_feedback_comments FOR SELECT USING (true);
CREATE POLICY "Comments creatable by team" ON internal_feedback_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can manage comments" ON internal_feedback_comments FOR ALL USING (true);

CREATE POLICY "Screen templates viewable by team" ON screen_templates FOR SELECT USING (true);
CREATE POLICY "Admin can manage screen templates" ON screen_templates FOR ALL USING (true);
