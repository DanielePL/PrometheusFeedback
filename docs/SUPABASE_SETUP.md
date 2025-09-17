# Supabase Tabellen Setup - Prometheus Feedback

## Anleitung:
1. Gehe zu https://dahuiizztlyxnfxpnqrv.supabase.co
2. Navigiere zu "Table Editor"
3. Erstelle die folgenden Tabellen:

## 1. Questions Tabelle

**Tabellenname:** `questions`

| Spalte        | Typ           | Optionen                    |
|---------------|---------------|-----------------------------|
| id            | int8          | Primary Key, Auto-increment |
| question_text | text          | Not null                    |
| question_type | varchar       | Default: 'rating'           |
| category      | varchar       |                             |
| section       | varchar       |                             |
| order_index   | int4          | Default: 0                  |
| is_active     | bool          | Default: true               |
| is_required   | bool          | Default: true               |
| options       | jsonb         |                             |
| created_at    | timestamptz   | Default: now()              |
| updated_at    | timestamptz   | Default: now()              |

## 2. Feedback Sessions Tabelle

**Tabellenname:** `feedback_sessions`

| Spalte        | Typ           | Optionen                    |
|---------------|---------------|-----------------------------|
| id            | uuid          | Primary Key, Default: gen_random_uuid() |
| user_email    | varchar       |                             |
| session_data  | jsonb         |                             |
| status        | varchar       | Default: 'started'          |
| started_at    | timestamptz   | Default: now()              |
| completed_at  | timestamptz   |                             |
| created_at    | timestamptz   | Default: now()              |
| updated_at    | timestamptz   | Default: now()              |

## 3. Feedback Responses Tabelle

**Tabellenname:** `feedback_responses`

| Spalte         | Typ           | Optionen                    |
|----------------|---------------|-----------------------------|
| id             | int8          | Primary Key, Auto-increment |
| session_id     | uuid          | Foreign Key -> feedback_sessions(id) |
| question_id    | int8          | Foreign Key -> questions(id) |
| response_value | jsonb         | Not null                    |
| rating         | int4          |                             |
| text_response  | text          |                             |
| created_at     | timestamptz   | Default: now()              |

## 4. Beispiel-Daten für Questions Tabelle

Nach dem Erstellen der Tabellen, füge diese Beispiel-Fragen hinzu:

```sql
INSERT INTO questions (question_text, question_type, category, section, order_index) VALUES
('How would you rate the overall user interface?', 'rating', 'UI/UX', 'General', 1),
('How satisfied are you with the app performance?', 'rating', 'Performance', 'Technical', 2),
('Would you recommend this app to others?', 'rating', 'General', 'Overall', 3),
('How easy is it to navigate the app?', 'rating', 'UI/UX', 'Navigation', 4),
('Rate the quality of training programs', 'rating', 'Content', 'Training', 5),
('How helpful are the coaching features?', 'rating', 'Features', 'Coaching', 6),
('Rate the accuracy of tracking features', 'rating', 'Features', 'Tracking', 7),
('Any additional feedback or suggestions?', 'text', 'General', 'Open', 8);
```

## 5. RLS (Row Level Security) Settings

Für jede Tabelle:
1. Gehe zu "Authentication" > "Policies"
2. Aktiviere RLS für alle Tabellen
3. Erstelle folgende Policies:

**Questions:**
- `SELECT` für `anon` role: `is_active = true`
- `ALL` für `service_role`

**Feedback Sessions:**
- `INSERT`, `SELECT`, `UPDATE` für `anon` role: `true`
- `ALL` für `service_role`

**Feedback Responses:**
- `INSERT`, `SELECT` für `anon` role: `true`
- `ALL` für `service_role`

## Alternative: SQL Editor verwenden

Du kannst auch den SQL Editor in Supabase verwenden und das komplette SQL-Script aus `docs/database_setup.sql` ausführen.
