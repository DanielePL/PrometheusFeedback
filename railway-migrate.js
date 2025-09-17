#!/usr/bin/env node

/**
 * Railway Migration Script
 * Automatisches Database Setup für Railway Deployment
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Environment Variables prüfen
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

console.log('🚀 Railway Migration Script gestartet...');
console.log(`📝 Node.js Version: ${process.version}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

// Check required environment variables
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error('❌ Fehlende Environment Variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('');
  console.error('🔧 Railway Setup:');
  console.error('   1. Gehe zu Railway Dashboard');
  console.error('   2. Wähle dein Projekt');
  console.error('   3. Gehe zu "Variables" Tab');
  console.error('   4. Füge folgende Variables hinzu:');
  console.error('      - SUPABASE_URL=https://your-project.supabase.co');
  console.error('      - SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.error('      - JWT_SECRET=your-secret-key');
  console.error('');
  console.error('📝 Template: .env.railway.template');
  console.error('📖 Guide: RAILWAY_DEPLOYMENT.md');
  process.exit(1);
}

async function runMigration() {
  try {
    console.log('📝 Verbinde mit Supabase...');
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Test connection
    const { data, error } = await supabase.from('questions').select('count').limit(1);
    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist yet
      throw new Error(`Supabase connection failed: ${error.message}`);
    }

    console.log('✅ Supabase Verbindung erfolgreich');

    // Read SQL setup file
    const sqlFile = path.join(__dirname, '../docs/database_setup.sql');
    if (!fs.existsSync(sqlFile)) {
      throw new Error(`SQL Setup file not found: ${sqlFile}`);
    }

    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    console.log('📄 SQL Setup file gelesen');

    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Führe ${statements.length} SQL-Statements aus...`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length === 0) continue;

      try {
        console.log(`⚡ Statement ${i + 1}/${statements.length}`);
        
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // Some errors are expected (like "already exists")
          if (error.message.includes('already exists') || 
              error.message.includes('does not exist') ||
              error.message.includes('duplicate key')) {
            console.log(`⚠️  Warnung bei Statement ${i + 1}: ${error.message}`);
          } else {
            console.error(`❌ Fehler bei Statement ${i + 1}: ${error.message}`);
            console.error(`SQL: ${statement.substring(0, 100)}...`);
          }
        }
      } catch (err) {
        console.error(`❌ Exception bei Statement ${i + 1}: ${err.message}`);
      }
    }

    // Verify tables were created
    console.log('🔍 Prüfe erstellte Tabellen...');
    
    const tables = [
      'questions',
      'feedback_sessions', 
      'feedback_responses',
      'team_members',
      'internal_feedback',
      'internal_feedback_comments',
      'screen_templates'
    ];

    for (const table of tables) {
      const { error } = await supabase.from(table).select('count').limit(1);
      if (error) {
        console.error(`❌ Tabelle '${table}' nicht gefunden: ${error.message}`);
      } else {
        console.log(`✅ Tabelle '${table}' verfügbar`);
      }
    }

    // Check sample data
    const { data: questions } = await supabase.from('questions').select('count');
    const questionCount = questions?.[0]?.count || 0;
    
    console.log(`📊 ${questionCount} Beispiel-Fragen in der Datenbank`);
    console.log('🎉 Railway Migration erfolgreich abgeschlossen!');
    console.log('🔗 Supabase Dashboard:', process.env.SUPABASE_URL.replace('supabase.co', 'supabase.co/project/table/editor'));
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration fehlgeschlagen:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run migration
runMigration();