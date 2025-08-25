const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL und Service Role Key sind erforderlich');
}

// Create Supabase client with service role key for server-side operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

class SupabaseService {
  constructor() {
    this.client = supabase;
  }

  // Test database connection
  async testConnection() {
    try {
      const { data, error } = await this.client
        .from('feedback_sessions')
        .select('id')
        .limit(1);
      
      if (error) throw error;
      return { success: true, message: 'Datenbankverbindung erfolgreich' };
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Feedback Sessions
  async createFeedbackSession(userEmail = null) {
    try {
      const sessionData = {
        user_email: userEmail,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const { data, error } = await this.client
        .from('feedback_sessions')
        .insert([sessionData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating feedback session:', error);
      return { success: false, error: error.message };
    }
  }

  async getFeedbackSession(sessionId) {
    try {
      const { data, error } = await this.client
        .from('feedback_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting feedback session:', error);
      return { success: false, error: error.message };
    }
  }

  async completeFeedbackSession(sessionId) {
    try {
      const { data, error } = await this.client
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
      console.error('Error completing feedback session:', error);
      return { success: false, error: error.message };
    }
  }

  async getAllSessions(limit = 100, offset = 0) {
    try {
      const { data, error, count } = await this.client
        .from('feedback_sessions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { success: true, data, count };
    } catch (error) {
      console.error('Error getting all sessions:', error);
      return { success: false, error: error.message };
    }
  }

  // Questions Management
  async getActiveQuestions() {
    try {
      const { data, error } = await this.client
        .from('questions')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting active questions:', error);
      return { success: false, error: error.message };
    }
  }

  async getAllQuestions() {
    try {
      const { data, error } = await this.client
        .from('questions')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting all questions:', error);
      return { success: false, error: error.message };
    }
  }

  async createQuestion(questionData) {
    try {
      const { data, error } = await this.client
        .from('questions')
        .insert([{
          ...questionData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating question:', error);
      return { success: false, error: error.message };
    }
  }

  async updateQuestion(questionId, questionData) {
    try {
      const { data, error } = await this.client
        .from('questions')
        .update(questionData)
        .eq('id', questionId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating question:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteQuestion(questionId) {
    try {
      // First, delete related responses
      await this.client
        .from('responses')
        .delete()
        .eq('question_id', questionId);

      // Then delete the question
      const { error } = await this.client
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting question:', error);
      return { success: false, error: error.message };
    }
  }

  async toggleQuestionActive(questionId) {
    try {
      // First get current status
      const { data: question, error: getError } = await this.client
        .from('questions')
        .select('is_active')
        .eq('id', questionId)
        .single();

      if (getError) throw getError;

      // Toggle the status
      const { data, error } = await this.client
        .from('questions')
        .update({ is_active: !question.is_active })
        .eq('id', questionId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error toggling question active status:', error);
      return { success: false, error: error.message };
    }
  }

  // Responses Management
  async saveResponse(sessionId, questionId, responseValue, ratingValue = null) {
    try {
      const responseData = {
        session_id: sessionId,
        question_id: questionId,
        response_value: responseValue,
        rating_value: ratingValue,
        created_at: new Date().toISOString()
      };

      const { data, error } = await this.client
        .from('responses')
        .insert([responseData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error saving response:', error);
      return { success: false, error: error.message };
    }
  }

  async getResponsesBySession(sessionId) {
    try {
      const { data, error } = await this.client
        .from('responses')
        .select(`
          *,
          questions (
            question_text,
            question_type,
            category
          )
        `)
        .eq('session_id', sessionId);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting responses by session:', error);
      return { success: false, error: error.message };
    }
  }

  async getAllResponses() {
    try {
      const { data, error } = await this.client
        .from('responses')
        .select(`
          *,
          questions (
            question_text,
            question_type,
            category
          ),
          feedback_sessions (
            created_at,
            completed_at,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting all responses:', error);
      return { success: false, error: error.message };
    }
  }

  // Analytics
  async getAnalyticsSummary() {
    try {
      const { data, error } = await this.client
        .from('analytics_summary')
        .select(`
          *,
          questions (
            question_text,
            question_type,
            category
          )
        `)
        .order('avg_rating', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting analytics summary:', error);
      return { success: false, error: error.message };
    }
  }

  async updateAnalyticsSummary() {
    try {
      // This would typically be done with a database function or trigger
      // For now, we'll calculate it manually
      
      const { data: responses, error: responsesError } = await this.client
        .from('responses')
        .select('question_id, rating_value, response_value');

      if (responsesError) throw responsesError;

      // Group responses by question
      const responsesByQuestion = responses.reduce((acc, response) => {
        if (!acc[response.question_id]) {
          acc[response.question_id] = [];
        }
        acc[response.question_id].push(response);
        return acc;
      }, {});

      // Calculate analytics for each question
      const analyticsData = [];
      for (const [questionId, questionResponses] of Object.entries(responsesByQuestion)) {
        const ratings = questionResponses
          .filter(r => r.rating_value !== null)
          .map(r => r.rating_value);
        
        const avgRating = ratings.length > 0 
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
          : 0;

        const positiveCount = ratings.filter(r => r >= 4).length;
        const negativeCount = ratings.filter(r => r <= 2).length;

        analyticsData.push({
          question_id: questionId,
          avg_rating: Math.round(avgRating * 100) / 100,
          total_responses: questionResponses.length,
          positive_count: positiveCount,
          negative_count: negativeCount,
          last_updated: new Date().toISOString()
        });
      }

      // Upsert analytics data
      const { error: upsertError } = await this.client
        .from('analytics_summary')
        .upsert(analyticsData, { onConflict: 'question_id' });

      if (upsertError) throw upsertError;

      return { success: true, data: analyticsData };
    } catch (error) {
      console.error('Error updating analytics summary:', error);
      return { success: false, error: error.message };
    }
  }

  // Utility function to initialize default questions
  async initializeDefaultQuestions() {
    try {
      const CONSTANTS = require('../utils/constants');
      
      // Check if questions already exist
      const { data: existingQuestions } = await this.client
        .from('questions')
        .select('id')
        .limit(1);

      if (existingQuestions && existingQuestions.length > 0) {
        return { success: true, message: 'Questions already exist' };
      }

      // Insert default questions
      const { data, error } = await this.client
        .from('questions')
        .insert(CONSTANTS.DEFAULT_QUESTIONS.map(q => ({
          ...q,
          created_at: new Date().toISOString()
        })))
        .select();

      if (error) throw error;
      return { success: true, data, message: 'Default questions initialized' };
    } catch (error) {
      console.error('Error initializing default questions:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new SupabaseService();
