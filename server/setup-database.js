const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Environment Variables laden
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY sind erforderlich');
  process.exit(1);
}

// Supabase Client mit Service Role Key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 Starte Datenbank-Setup...');

    // SQL Script lesen
    const sqlPath = path.join(__dirname, '../docs/database_setup.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');

    // SQL-Script in einzelne Statements aufteilen
    const statements = sqlScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Führe ${statements.length} SQL-Statements aus...`);

    // Statements einzeln ausführen
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`⚡ Statement ${i + 1}/${statements.length}`);
        
        const { error } = await supabase.rpc('exec_sql', { 
          sql: statement + ';' 
        });

        if (error) {
          console.warn(`⚠️  Warnung bei Statement ${i + 1}:`, error.message);
          // Weiter machen, da manche Statements Fehler werfen können (z.B. wenn Tabellen bereits existieren)
        }
      }
    }

    // Tabellen prüfen
    console.log('🔍 Prüfe erstellte Tabellen...');
    
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('count')
      .limit(1);

    const { data: sessions, error: sessionsError } = await supabase
      .from('feedback_sessions')
      .select('count')
      .limit(1);

    const { data: responses, error: responsesError } = await supabase
      .from('feedback_responses')
      .select('count')
      .limit(1);

    if (!questionsError && !sessionsError && !responsesError) {
      console.log('✅ Alle Tabellen erfolgreich erstellt!');
      
      // Anzahl der Beispiel-Fragen prüfen
      const { data: questionCount, error: countError } = await supabase
        .from('questions')
        .select('*');

      if (!countError) {
        console.log(`📊 ${questionCount.length} Beispiel-Fragen in der Datenbank`);
      }

    } else {
      console.error('❌ Fehler beim Prüfen der Tabellen:', {
        questionsError,
        sessionsError,
        responsesError
      });
    }

    console.log('🎉 Datenbank-Setup abgeschlossen!');
    console.log('🔗 Supabase Dashboard:', `${supabaseUrl.replace('.co', '.co/project/table/editor')}`);
    
  } catch (error) {
    console.error('💥 Fehler beim Datenbank-Setup:', error);
    process.exit(1);
  }
}

// Setup ausführen
setupDatabase();
