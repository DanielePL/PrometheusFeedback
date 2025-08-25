# Prometheus Feedback Tool

Ein mobil-optimiertes Feedback-System für die Prometheus Training App, entwickelt mit React (Frontend) und Node.js (Backend) sowie Supabase als Datenbank.

## 🚀 Features

### Frontend (React)
- **Mobile-First Design** - Optimiert für Smartphones und Tablets
- **Prometheus Branding** - Orange (#ff6600) + Dark Theme
- **Intuitive Feedback-Form** - Stepper-UI mit Progress-Anzeige
- **Rating-System** - 1-5 Sterne Bewertungen
- **Admin Dashboard** - Verwaltung und Analytics
- **Responsive Design** - Tailwind CSS Framework
- **Real-time Validierung** - Sofortiges Feedback bei Eingaben

### Backend (Node.js)
- **RESTful API** - Express.js Server
- **Supabase Integration** - PostgreSQL Datenbank
- **JWT Authentication** - Sichere Admin-Authentifizierung
- **Rate Limiting** - Schutz vor Missbrauch
- **Input Validation** - Umfassende Eingabevalidierung
- **Error Handling** - Strukturierte Fehlerbehandlung
- **Analytics Engine** - Automatische Statistik-Generierung

### Sicherheit
- **CORS Protection** - Konfigurierbare Cross-Origin-Requests
- **Helmet.js** - Sicherheits-Headers
- **Input Sanitization** - XSS-Schutz
- **JWT Tokens** - Sichere Session-Verwaltung
- **Rate Limiting** - API-Missbrauchsschutz

## 📁 Projektstruktur

```
prometheus-feedback/
├── client/                     # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # React Komponenten
│   │   ├── pages/             # Seiten-Komponenten
│   │   ├── context/           # React Context für State Management
│   │   ├── services/          # API Services
│   │   ├── utils/             # Hilfsfunktionen
│   │   └── ...
│   ├── package.json
│   └── tailwind.config.js
├── server/                     # Node.js Backend
│   ├── routes/                # API Routes
│   ├── middleware/            # Express Middleware
│   ├── services/              # Business Logic
│   ├── utils/                 # Hilfsfunktionen
│   ├── index.js               # Server Entry Point
│   └── package.json
├── docs/                      # Dokumentation
├── package.json              # Root Package
└── README.md
```

## 🛠️ Setup & Installation

### Voraussetzungen
- Node.js >= 16.0.0
- npm oder yarn
- Supabase Account

### 1. Repository klonen
```bash
git clone https://github.com/your-username/prometheus-feedback.git
cd prometheus-feedback
```

### 2. Dependencies installieren
```bash
npm run install:all
```

### 3. Umgebungsvariablen konfigurieren

**Client (.env):**
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=http://localhost:5000/api
```

**Server (.env):**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_PASSWORD=prometheus_admin_2024
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Supabase Datenbank Setup
Führen Sie die SQL-Befehle aus `docs/database-schema.sql` in Ihrem Supabase Dashboard aus.

### 5. Entwicklungsserver starten
```bash
npm run dev
```

Dies startet sowohl den React-Client (Port 3000) als auch den Node.js-Server (Port 5000).

## 🔧 Verfügbare Scripts

### Root Level
- `npm run dev` - Startet Client und Server gleichzeitig
- `npm run client` - Startet nur den React-Client
- `npm run server` - Startet nur den Node.js-Server
- `npm run build` - Erstellt Production Build
- `npm run install:all` - Installiert alle Dependencies

### Client
- `npm start` - Entwicklungsserver
- `npm run build` - Production Build
- `npm test` - Tests ausführen

### Server
- `npm start` - Production Server
- `npm run dev` - Entwicklungsserver mit Nodemon

## 📊 Datenbank Schema

### Tabellen

#### feedback_sessions
- `id` (uuid, primary key)
- `user_email` (text, optional)
- `status` (enum: pending/completed)
- `created_at` (timestamp)
- `completed_at` (timestamp)

#### questions
- `id` (uuid, primary key)
- `question_text` (text)
- `question_type` (enum: rating/text/multiple_choice)
- `category` (enum: features/performance/bugs/general/ai_coaching/community)
- `is_active` (boolean)
- `order_index` (integer)
- `options` (jsonb, für multiple choice)
- `created_at` (timestamp)

#### responses
- `id` (uuid, primary key)
- `session_id` (uuid, foreign key)
- `question_id` (uuid, foreign key)
- `response_value` (text)
- `rating_value` (integer, 1-5)
- `created_at` (timestamp)

#### analytics_summary
- `id` (uuid, primary key)
- `question_id` (uuid, foreign key)
- `avg_rating` (decimal)
- `total_responses` (integer)
- `positive_count` (integer)
- `negative_count` (integer)
- `last_updated` (timestamp)

## 🔌 API Endpoints

### Feedback API (`/api/feedback`)
- `POST /start` - Neue Session starten
- `GET /questions` - Aktive Fragen laden
- `POST /submit` - Feedback einreichen
- `GET /session/:id` - Session-Details
- `GET /health` - System-Status

### Admin API (`/api/admin`)
- `POST /login` - Admin-Anmeldung
- `GET /verify` - Token-Verifikation
- `GET /analytics` - Dashboard-Analytics
- `GET /sessions` - Alle Sessions
- `GET /responses` - Alle Antworten
- `GET /export` - Daten-Export
- `GET /questions` - Fragen-Verwaltung
- `POST /questions` - Neue Frage erstellen
- `PUT /questions/:id` - Frage bearbeiten
- `DELETE /questions/:id` - Frage löschen
- `PATCH /questions/:id/toggle` - Frage aktivieren/deaktivieren

### Analytics API (`/api/analytics`)
- `GET /summary` - Analytics-Übersicht
- `GET /by-category` - Nach Kategorie gruppiert
- `GET /trends` - Zeitverlauf-Trends
- `GET /performance` - Performance-Metriken
- `GET /completion` - Abschlussraten
- `POST /update` - Analytics aktualisieren

## 🎨 UI/UX Features

### Responsive Design
- Mobile-First Ansatz
- Optimiert für Touch-Eingaben
- Adaptive Layout für verschiedene Bildschirmgrößen

### Prometheus Branding
- Hauptfarbe: Prometheus Orange (#ff6600)
- Dunkles Theme für bessere Lesbarkeit
- Konsistente Typografie und Spacing

### User Experience
- Intuitive Navigation
- Progress-Anzeige während Feedback-Prozess
- Sofortiges visuelles Feedback
- Barrierefreie Bedienung
- Offline-Unterstützung (geplant)

## 🔒 Sicherheit

### Authentication
- JWT-basierte Admin-Authentifizierung
- Sichere Token-Verwaltung
- Session-Timeout

### Input Validation
- Server-seitige Validierung aller Eingaben
- XSS-Schutz durch Input-Sanitization
- SQL-Injection-Schutz durch Supabase ORM

### Rate Limiting
- API-Anfragen pro IP begrenzt
- Strikte Limits für Admin-Endpoints
- Brute-Force-Schutz für Login

## 📈 Analytics & Reporting

### Dashboard Metriken
- Gesamtanzahl Sessions
- Abschlussrate
- Durchschnittliche Bewertungen
- Top/Worst bewertete Features

### Export-Funktionen
- JSON-Export für Entwickler
- CSV-Export für Business-Analyse
- Anonymisierte Daten

### Trend-Analyse
- Zeitverlauf der Bewertungen
- Kategorie-Performance
- Completion-Rate-Trends

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables (Production)
Stellen Sie sicher, dass alle Umgebungsvariablen für die Produktion gesetzt sind:
- `NODE_ENV=production`
- Sichere JWT_SECRET
- Production Supabase Credentials
- HTTPS URLs

### Empfohlene Hosting-Plattformen
- **Frontend**: Vercel, Netlify, AWS CloudFront
- **Backend**: Railway, Heroku, AWS EC2
- **Datenbank**: Supabase (bereits konfiguriert)

## 🧪 Testing

### Frontend Tests
```bash
cd client
npm test
```

### Backend Tests
```bash
cd server
npm test
```

## 🤝 Contributing

1. Fork das Repository
2. Erstellen Sie einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committen Sie Ihre Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffnen Sie eine Pull Request

## 📝 Lizenz

Dieses Projekt ist unter der ISC Lizenz lizenziert - siehe die [LICENSE](LICENSE) Datei für Details.

## 🆘 Support

Bei Fragen oder Problemen:

- **Email**: feedback@prometheus.app
- **Issues**: GitHub Issues Tab
- **Dokumentation**: `/docs` Ordner

## 🔄 Changelog

### Version 1.0.0
- Initial Release
- Basis Feedback-System
- Admin Dashboard
- Supabase Integration
- Mobile-optimierte UI

---

Entwickelt mit ❤️ für besseres Training mit Prometheus