# Railway Deployment Guide - Prometheus Feedback

## 🚀 Deployment Steps

### 1. Vorbereitung
```bash
# Erstelle Production Build
npm run build:production

# Teste lokalen Production Build
NODE_ENV=production npm start
```

### 2. Railway Setup
1. Gehe zu [railway.app](https://railway.app)
2. Verbinde dein GitHub Repository
3. Erstelle ein neues Projekt aus diesem Repository

### 3. Environment Variables setzen (KRITISCH!)
In Railway Dashboard → Variables → Add Variable:

**REQUIRED (Server crasht ohne diese):**
```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-super-secret-jwt-key-here
```

**OPTIONAL:**
```bash
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-app-name.railway.app
```

### 4. CORS Origin konfigurieren
Nach dem ersten Deployment:
```bash
CORS_ORIGIN=https://your-app-name.railway.app
```

### 5. Deployment
Railway deployed automatisch bei jedem Git Push zu `main`.

## ⚠️ Wichtige Fixes

### Node.js Version
- ✅ **Fixed:** Node.js 20+ für Supabase Kompatibilität
- ✅ **Fixed:** Environment Variables Check beim Startup
- ✅ **Fixed:** Bessere Fehlermeldungen für fehlende Variablen

### Environment Variables
Der Server **MUSS** folgende Variables haben:
1. `SUPABASE_URL`
2. `SUPABASE_SERVICE_ROLE_KEY`
3. `JWT_SECRET` (optional, aber empfohlen)

## 📝 Features

### ✅ Production Ready
- [x] Dockerfile für Container Deployment
- [x] Railway.toml Konfiguration
- [x] Static File Serving für React App
- [x] Environment Variable Management
- [x] Automatic Database Migration
- [x] Security Headers (Helmet)
- [x] Rate Limiting
- [x] Error Handling
- [x] Graceful Shutdown

### ✅ Database Setup
- [x] Automatisches Supabase Schema Setup
- [x] Team Members Management
- [x] Internal Feedback System
- [x] Screenshot Upload Support
- [x] Row Level Security (RLS)

## 🔧 Troubleshooting

### Database Migration Issues
```bash
# Manuelle Migration ausführen
node railway-migrate.js
```

### CORS Issues
Stelle sicher, dass `CORS_ORIGIN` auf deine Railway URL gesetzt ist:
```bash
CORS_ORIGIN=https://your-app-name.railway.app
```

### Build Issues
```bash
# Dependencies neu installieren
npm run install:all

# Lokalen Build testen
npm run build:production
```

## 📊 Monitoring

### Health Check
```
GET https://your-app.railway.app/health
```

### Logs
Railway Dashboard → Deployments → View Logs

## 🔒 Security

- JWT Authentication für Admin
- Rate Limiting aktiviert
- Security Headers (Helmet)
- CORS konfiguriert
- Environment Variables secured

## 🚀 Ready for Production!

Deine App ist jetzt bereit für Railway Deployment mit:
- 📱 Customer Feedback System
- 🔧 Internal Bug Tracking
- 👥 Team Management
- 📸 Screenshot Upload
- 📊 Analytics Dashboard