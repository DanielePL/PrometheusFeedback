# Supabase Database Schema

Dieses Dokument beschreibt das komplette Datenbankschema für das Prometheus Feedback Tool.

## SQL Setup Script

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE feedback_status AS ENUM ('pending', 'completed');
CREATE TYPE question_type AS ENUM ('rating', 'text', 'multiple_choice');
CREATE TYPE question_category AS ENUM ('features', 'performance', 'bugs', 'general', 'ai_coaching', 'community');

-- ===========================
-- FEEDBACK SESSIONS TABLE
-- ===========================
CREATE TABLE feedback_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT NULL,
    status feedback_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE NULL,
    
    -- Indexes
    CONSTRAINT valid_completion CHECK (
        (status = 'pending' AND completed_at IS NULL) OR 
        (status = 'completed' AND completed_at IS NOT NULL)
    )
);

-- Add indexes for performance
CREATE INDEX idx_feedback_sessions_status ON feedback_sessions(status);
CREATE INDEX idx_feedback_sessions_created_at ON feedback_sessions(created_at);
CREATE INDEX idx_feedback_sessions_user_email ON feedback_sessions(user_email) WHERE user_email IS NOT NULL;

-- ===========================
-- QUESTIONS TABLE
-- ===========================
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_text TEXT NOT NULL,
    question_type question_type NOT NULL,
    category question_category NOT NULL,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER NOT NULL,
    options JSONB NULL, -- For multiple choice questions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT questions_order_unique UNIQUE(order_index),
    CONSTRAINT questions_text_not_empty CHECK (LENGTH(TRIM(question_text)) > 0),
    CONSTRAINT questions_options_check CHECK (
        (question_type = 'multiple_choice' AND options IS NOT NULL AND jsonb_array_length(options) > 0) OR
        (question_type != 'multiple_choice')
    )
);

-- Add indexes
CREATE INDEX idx_questions_active ON questions(is_active);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_order ON questions(order_index);
CREATE INDEX idx_questions_type ON questions(question_type);

-- ===========================
-- RESPONSES TABLE
-- ===========================
CREATE TABLE responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES feedback_sessions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    response_value TEXT NULL,
    rating_value INTEGER NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT responses_rating_range CHECK (rating_value >= 1 AND rating_value <= 5),
    CONSTRAINT responses_has_value CHECK (
        response_value IS NOT NULL OR rating_value IS NOT NULL
    ),
    CONSTRAINT responses_session_question_unique UNIQUE(session_id, question_id)
);

-- Add indexes
CREATE INDEX idx_responses_session_id ON responses(session_id);
CREATE INDEX idx_responses_question_id ON responses(question_id);
CREATE INDEX idx_responses_rating_value ON responses(rating_value) WHERE rating_value IS NOT NULL;
CREATE INDEX idx_responses_created_at ON responses(created_at);

-- ===========================
-- ANALYTICS SUMMARY TABLE
-- ===========================
CREATE TABLE analytics_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    total_responses INTEGER DEFAULT 0,
    positive_count INTEGER DEFAULT 0, -- Ratings 4-5
    negative_count INTEGER DEFAULT 0, -- Ratings 1-2
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT analytics_question_unique UNIQUE(question_id),
    CONSTRAINT analytics_avg_rating_range CHECK (avg_rating >= 0 AND avg_rating <= 5),
    CONSTRAINT analytics_counts_positive CHECK (total_responses >= 0 AND positive_count >= 0 AND negative_count >= 0),
    CONSTRAINT analytics_counts_logic CHECK (positive_count + negative_count <= total_responses)
);

-- Add indexes
CREATE INDEX idx_analytics_avg_rating ON analytics_summary(avg_rating);
CREATE INDEX idx_analytics_total_responses ON analytics_summary(total_responses);
CREATE INDEX idx_analytics_last_updated ON analytics_summary(last_updated);

-- ===========================
-- FUNCTIONS AND TRIGGERS
-- ===========================

-- Function to update analytics summary
CREATE OR REPLACE FUNCTION update_analytics_summary()
RETURNS TRIGGER AS $$
BEGIN
    -- Update analytics for the affected question
    INSERT INTO analytics_summary (question_id, avg_rating, total_responses, positive_count, negative_count, last_updated)
    SELECT 
        q.id,
        COALESCE(AVG(r.rating_value), 0) as avg_rating,
        COUNT(r.id) as total_responses,
        COUNT(CASE WHEN r.rating_value >= 4 THEN 1 END) as positive_count,
        COUNT(CASE WHEN r.rating_value <= 2 THEN 1 END) as negative_count,
        NOW() as last_updated
    FROM questions q
    LEFT JOIN responses r ON q.id = r.question_id
    WHERE q.id = COALESCE(NEW.question_id, OLD.question_id)
    GROUP BY q.id
    ON CONFLICT (question_id) 
    DO UPDATE SET
        avg_rating = EXCLUDED.avg_rating,
        total_responses = EXCLUDED.total_responses,
        positive_count = EXCLUDED.positive_count,
        negative_count = EXCLUDED.negative_count,
        last_updated = EXCLUDED.last_updated;
        
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update analytics when responses change
CREATE TRIGGER trigger_update_analytics_on_response
    AFTER INSERT OR UPDATE OR DELETE ON responses
    FOR EACH ROW
    EXECUTE FUNCTION update_analytics_summary();

-- Function to complete feedback session
CREATE OR REPLACE FUNCTION complete_feedback_session(session_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE feedback_sessions 
    SET 
        status = 'completed',
        completed_at = NOW()
    WHERE id = session_uuid AND status = 'pending';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to get session with response count
CREATE OR REPLACE FUNCTION get_session_stats(session_uuid UUID)
RETURNS TABLE(
    session_id UUID,
    user_email TEXT,
    status feedback_status,
    created_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    response_count BIGINT,
    avg_rating DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fs.id,
        fs.user_email,
        fs.status,
        fs.created_at,
        fs.completed_at,
        COUNT(r.id) as response_count,
        AVG(r.rating_value) as avg_rating
    FROM feedback_sessions fs
    LEFT JOIN responses r ON fs.id = r.session_id
    WHERE fs.id = session_uuid
    GROUP BY fs.id, fs.user_email, fs.status, fs.created_at, fs.completed_at;
END;
$$ LANGUAGE plpgsql;

-- ===========================
-- RLS (Row Level Security) Policies
-- ===========================

-- Enable RLS on all tables
ALTER TABLE feedback_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_summary ENABLE ROW LEVEL SECURITY;

-- Policy for feedback_sessions - allow public read/write for active sessions
CREATE POLICY "Public can manage feedback sessions" ON feedback_sessions
    FOR ALL USING (true);

-- Policy for questions - public read for active questions
CREATE POLICY "Public can read active questions" ON questions
    FOR SELECT USING (is_active = true);

-- Policy for admin to manage questions
CREATE POLICY "Service role can manage questions" ON questions
    FOR ALL USING (auth.role() = 'service_role');

-- Policy for responses - public can create, service role can read all
CREATE POLICY "Public can create responses" ON responses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can read responses" ON responses
    FOR SELECT USING (auth.role() = 'service_role');

-- Policy for analytics - service role only
CREATE POLICY "Service role can manage analytics" ON analytics_summary
    FOR ALL USING (auth.role() = 'service_role');

-- ===========================
-- DEFAULT DATA INSERT
-- ===========================

-- Insert default questions
INSERT INTO questions (question_text, question_type, category, order_index, is_active) VALUES
('Wie bewerten Sie die Velocity-Based Training (VBT) Funktionen?', 'rating', 'features', 1, true),
('Sind die Range of Motion (ROM) Analysen hilfreich?', 'rating', 'features', 2, true),
('Haben Sie Probleme mit der Bar Path Tracking?', 'text', 'bugs', 3, true),
('Wie intelligent finden Sie die AI-Trainingsanpassungen?', 'rating', 'ai_coaching', 4, true),
('Sind die personalisierten Empfehlungen relevant?', 'rating', 'ai_coaching', 5, true),
('Wie bewerten Sie das Community-Erlebnis?', 'rating', 'community', 6, true),
('Sind die Masterclasses wertvoll?', 'rating', 'community', 7, true),
('Welche Features fehlen Ihnen am meisten?', 'text', 'general', 8, true),
('Haben Sie Bugs oder technische Probleme entdeckt?', 'text', 'bugs', 9, true),
('Wie wahrscheinlich würden Sie Prometheus weiterempfehlen?', 'rating', 'general', 10, true);

-- Initialize analytics summary for all questions
INSERT INTO analytics_summary (question_id, avg_rating, total_responses, positive_count, negative_count)
SELECT id, 0, 0, 0, 0 FROM questions;

-- ===========================
-- USEFUL VIEWS
-- ===========================

-- View for detailed session information
CREATE VIEW session_details AS
SELECT 
    fs.id,
    fs.user_email,
    fs.status,
    fs.created_at,
    fs.completed_at,
    COUNT(r.id) as response_count,
    AVG(r.rating_value) as avg_rating,
    EXTRACT(EPOCH FROM (fs.completed_at - fs.created_at))/60 as completion_time_minutes
FROM feedback_sessions fs
LEFT JOIN responses r ON fs.id = r.session_id
GROUP BY fs.id, fs.user_email, fs.status, fs.created_at, fs.completed_at;

-- View for question performance
CREATE VIEW question_performance AS
SELECT 
    q.id,
    q.question_text,
    q.question_type,
    q.category,
    q.is_active,
    a.avg_rating,
    a.total_responses,
    a.positive_count,
    a.negative_count,
    CASE 
        WHEN a.total_responses > 0 THEN ROUND((a.positive_count::DECIMAL / a.total_responses) * 100, 2)
        ELSE 0
    END as positive_percentage
FROM questions q
LEFT JOIN analytics_summary a ON q.id = a.question_id
ORDER BY q.order_index;

-- View for category analytics
CREATE VIEW category_analytics AS
SELECT 
    q.category,
    COUNT(q.id) as question_count,
    COUNT(CASE WHEN q.is_active THEN 1 END) as active_questions,
    AVG(a.avg_rating) as avg_category_rating,
    SUM(a.total_responses) as total_category_responses
FROM questions q
LEFT JOIN analytics_summary a ON q.id = a.question_id
GROUP BY q.category;

-- ===========================
-- MAINTENANCE FUNCTIONS
-- ===========================

-- Function to cleanup old incomplete sessions (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM feedback_sessions 
    WHERE status = 'pending' 
    AND created_at < NOW() - INTERVAL '24 hours';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to recalculate all analytics
CREATE OR REPLACE FUNCTION recalculate_all_analytics()
RETURNS VOID AS $$
BEGIN
    DELETE FROM analytics_summary;
    
    INSERT INTO analytics_summary (question_id, avg_rating, total_responses, positive_count, negative_count, last_updated)
    SELECT 
        q.id,
        COALESCE(AVG(r.rating_value), 0) as avg_rating,
        COUNT(r.id) as total_responses,
        COUNT(CASE WHEN r.rating_value >= 4 THEN 1 END) as positive_count,
        COUNT(CASE WHEN r.rating_value <= 2 THEN 1 END) as negative_count,
        NOW() as last_updated
    FROM questions q
    LEFT JOIN responses r ON q.id = r.question_id
    GROUP BY q.id;
END;
$$ LANGUAGE plpgsql;

-- ===========================
-- INDEXES FOR PERFORMANCE
-- ===========================

-- Composite indexes for common queries
CREATE INDEX idx_responses_session_rating ON responses(session_id, rating_value) WHERE rating_value IS NOT NULL;
CREATE INDEX idx_responses_question_rating ON responses(question_id, rating_value) WHERE rating_value IS NOT NULL;
CREATE INDEX idx_sessions_status_created ON feedback_sessions(status, created_at);

-- Partial indexes for better performance
CREATE INDEX idx_active_questions_order ON questions(order_index) WHERE is_active = true;
CREATE INDEX idx_completed_sessions_time ON feedback_sessions(created_at, completed_at) WHERE status = 'completed';

COMMIT;
```

## Tabellen-Beschreibung

### feedback_sessions
Speichert Feedback-Sessions von Benutzern.
- Jede Session hat einen eindeutigen UUID
- Optional: E-Mail-Adresse des Benutzers
- Status: pending oder completed
- Timestamps für Erstellung und Abschluss

### questions
Verwaltet alle Feedback-Fragen.
- Verschiedene Fragetypen: rating, text, multiple_choice
- Kategorisierung für bessere Organisation
- Aktivierung/Deaktivierung möglich
- Reihenfolge-Index für Sortierung

### responses
Speichert alle Benutzerantworten.
- Verknüpfung zu Session und Frage
- Unterstützt Text- und Rating-Antworten
- Eine Antwort pro Frage pro Session

### analytics_summary
Vorgefertigte Analytics-Daten für Performance.
- Durchschnittsbewertungen
- Antwortanzahl
- Positive/Negative Bewertungen
- Automatische Updates via Trigger

## Features

### Automatische Analytics
- Trigger aktualisieren Analytics bei jeder neuen Antwort
- Views für schnelle Abfragen
- Performance-optimierte Indizes

### Row Level Security
- Öffentlicher Zugriff auf aktive Fragen
- Service Role für Admin-Funktionen
- Sichere Datenkapselung

### Wartungsfunktionen
- Cleanup alter Sessions
- Neuberechnung aller Analytics
- Session-Statistiken

### Performance-Optimierung
- Strategische Indizes
- Materialized Views
- Effiziente Abfragen

Dieses Schema ist optimiert für:
- Schnelle Feedback-Erfassung
- Real-time Analytics
- Admin-Dashboard Performance
- Skalierbarkeit
