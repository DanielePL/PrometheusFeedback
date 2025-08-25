import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL und Anon Key sind erforderlich. Bitte überprüfe deine .env Datei.');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Helper Functions für Supabase
export const supabaseHelpers = {
  // Test Verbindung
  async testConnection() {
    try {
      const { data, error } = await supabase.from('feedback_sessions').select('id').limit(1);
      if (error) throw error;
      return { success: true, message: 'Verbindung erfolgreich' };
    } catch (error) {
      console.error('Supabase Verbindungsfehler:', error);
      return { success: false, message: error.message };
    }
  },

  // Feedback Session erstellen
  async createFeedbackSession(userEmail = null) {
    try {
      const sessionToken = Math.random().toString(36).substr(2, 16);
      
      const { data, error } = await supabase
        .from('feedback_sessions')
        .insert([
          {
            session_token: sessionToken,
            user_email: userEmail,
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data, sessionToken };
    } catch (error) {
      console.error('Fehler beim Erstellen der Session:', error);
      return { success: false, error: error.message };
    }
  },

  // Aktive Fragen laden
  async getActiveQuestions() {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Fehler beim Laden der Fragen:', error);
      return { success: false, error: error.message };
    }
  },

  // Antwort speichern
  async saveResponse(sessionId, questionId, responseValue, ratingValue = null) {
    try {
      const { data, error } = await supabase
        .from('responses')
        .insert([
          {
            session_id: sessionId,
            question_id: questionId,
            response_value: responseValue,
            rating_value: ratingValue,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Fehler beim Speichern der Antwort:', error);
      return { success: false, error: error.message };
    }
  },

  // Session als abgeschlossen markieren
  async completeSession(sessionId) {
    try {
      const { data, error } = await supabase
        .from('feedback_sessions')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Fehler beim Abschließen der Session:', error);
      return { success: false, error: error.message };
    }
  },

  // Analytics Daten laden (für Admin Dashboard)
  async getAnalytics() {
    try {
      const { data, error } = await supabase
        .from('analytics_summary')
        .select(`
          *,
          questions (
            question_text,
            category,
            question_type
          )
        `)
        .order('avg_rating', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Fehler beim Laden der Analytics:', error);
      return { success: false, error: error.message };
    }
  }
};
