# Deployment Guide

Vollständige Anleitung für das Deployment des Prometheus Feedback Tools.

## 🚀 Production Deployment

### Voraussetzungen

- Node.js 18+ 
- npm oder yarn
- Supabase Account
- Domain mit SSL-Zertifikat
- PM2 für Prozess-Management (empfohlen)

### 1. Supabase Setup

#### Database Setup
```sql
-- Führe das komplette Schema aus docs/DATABASE.md aus
-- Oder nutze die Migrations im /migrations Ordner
```

#### Environment Variables in Supabase
```bash
# Supabase Dashboard -> Settings -> API
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Row Level Security
Stelle sicher, dass RLS aktiviert ist:
```sql
-- Bereits im Schema enthalten
ALTER TABLE feedback_sessions ENABLE ROW LEVEL SECURITY;
-- etc.
```

### 2. Server Deployment

#### Environment Variables
```bash
# /server/.env
NODE_ENV=production
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_super_secure_jwt_secret_min_64_chars
ADMIN_EMAIL=admin@yourcompany.com
ADMIN_PASSWORD=your_secure_admin_password
CORS_ORIGIN=https://your-domain.com
```

#### Build und Start
```bash
cd server
npm install --production
npm start
```

#### PM2 Setup (Empfohlen)
```bash
# Install PM2 global
npm install -g pm2

# PM2 Ecosystem File
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'prometheus-feedback-api',
    script: './server.js',
    cwd: './server',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 3. Client Deployment

#### Build für Production
```bash
cd client
npm install
npm run build
```

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/prometheus-feedback
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Serve React App
    location / {
        root /var/www/prometheus-feedback/client/build;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API Proxy
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Security: Deny access to sensitive files
    location ~ /\. {
        deny all;
    }
}
```

#### Apache Configuration (Alternative)
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    Redirect permanent / https://your-domain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /var/www/prometheus-feedback/client/build
    
    SSLEngine on
    SSLCertificateFile /path/to/your/certificate.crt
    SSLCertificateKeyFile /path/to/your/private.key
    
    # Security Headers
    Header always set X-Frame-Options DENY
    Header always set X-Content-Type-Options nosniff
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    
    # Serve React App
    <Directory "/var/www/prometheus-feedback/client/build">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        FallbackResource /index.html
    </Directory>
    
    # Cache static assets
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </LocationMatch>
    
    # API Proxy
    ProxyPreserveHost On
    ProxyPass /api/ http://localhost:3001/api/
    ProxyPassReverse /api/ http://localhost:3001/api/
</VirtualHost>
```

## 🐳 Docker Deployment

### Docker Compose Setup
```yaml
# docker-compose.yml
version: '3.8'

services:
  prometheus-feedback-api:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: prometheus-feedback-api
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - JWT_SECRET=${JWT_SECRET}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - CORS_ORIGIN=${CORS_ORIGIN}
    volumes:
      - ./server/logs:/app/logs
    networks:
      - prometheus-network

  prometheus-feedback-web:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: prometheus-feedback-web
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - prometheus-feedback-api
    networks:
      - prometheus-network

networks:
  prometheus-network:
    driver: bridge
```

### Server Dockerfile
```dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3001

CMD ["node", "server.js"]
```

### Client Dockerfile
```dockerfile
# client/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
```

## ☁️ Cloud Deployment

### Vercel (Client Only)
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "cd client && npm run build",
        "outputDirectory": "client/build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-api-domain.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://your-api-domain.com"
  }
}
```

### Heroku (Server)
```yaml
# server/Procfile
web: node server.js
```

```json
// server/package.json - add scripts
{
  "scripts": {
    "heroku-postbuild": "echo 'Build completed'"
  }
}
```

### DigitalOcean App Platform
```yaml
# .do/app.yaml
name: prometheus-feedback
services:
- name: api
  source_dir: /server
  github:
    repo: your-username/prometheus-feedback
    branch: main
  run_command: node server.js
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: SUPABASE_URL
    value: ${SUPABASE_URL}
  - key: SUPABASE_SERVICE_ROLE_KEY
    value: ${SUPABASE_SERVICE_ROLE_KEY}
  - key: JWT_SECRET
    value: ${JWT_SECRET}

- name: web
  source_dir: /client
  github:
    repo: your-username/prometheus-feedback
    branch: main
  build_command: npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  routes:
  - path: /
  envs:
  - key: REACT_APP_API_URL
    value: ${api.PUBLIC_URL}
```

## 🔐 Security Checklist

### SSL/TLS
- [ ] SSL-Zertifikat installiert
- [ ] HTTP zu HTTPS Weiterleitung
- [ ] HSTS Header gesetzt
- [ ] TLS 1.2+ konfiguriert

### Environment Variables
- [ ] Alle sensiblen Daten in Environment Variables
- [ ] JWT_SECRET mindestens 64 Zeichen
- [ ] Starke Passwörter für Admin
- [ ] CORS auf spezifische Domains beschränkt

### Security Headers
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Content-Security-Policy konfiguriert

### Database Security
- [ ] Supabase RLS aktiviert
- [ ] Service Role Key sicher gespeichert
- [ ] Backup-Strategie implementiert

### Monitoring
- [ ] Error Logging aktiviert
- [ ] Performance Monitoring
- [ ] Uptime Monitoring
- [ ] Log Rotation konfiguriert

## 📊 Monitoring & Wartung

### PM2 Monitoring
```bash
# Process status
pm2 status

# Logs anzeigen
pm2 logs prometheus-feedback-api

# Restart app
pm2 restart prometheus-feedback-api

# Monitor resources
pm2 monit
```

### Health Checks
```bash
# API Health Check
curl https://your-domain.com/api/health

# Database Connection Check
curl https://your-domain.com/api/admin/status
```

### Backup Strategy
```bash
# Supabase Backup (automatisch verfügbar)
# Manueller Export via Dashboard

# Application Logs Backup
tar -czf logs-backup-$(date +%Y%m%d).tar.gz ./server/logs

# Environment Backup
cp .env .env.backup.$(date +%Y%m%d)
```

### Updates
```bash
# Update dependencies
cd server && npm update
cd client && npm update

# Security updates
npm audit fix

# Rebuild and redeploy
npm run build:all
pm2 restart prometheus-feedback-api
```

## 🚨 Troubleshooting

### Häufige Probleme

#### API nicht erreichbar
```bash
# Check process
pm2 status
netstat -tlnp | grep 3001

# Check logs
pm2 logs prometheus-feedback-api
tail -f ./server/logs/combined.log
```

#### Database Connection Issues
```bash
# Test Supabase connection
curl -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     "https://YOUR_PROJECT.supabase.co/rest/v1/questions?select=*&limit=1"
```

#### Frontend Build Issues
```bash
# Clear cache and rebuild
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### SSL Certificate Issues
```bash
# Test SSL
openssl s_client -connect your-domain.com:443

# Renew Let's Encrypt
certbot renew --dry-run
```

### Performance Optimization
```bash
# Enable gzip compression in nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

# Database optimization
ANALYZE; -- In Supabase SQL Editor
```

Diese Deployment-Anleitung deckt alle wichtigen Aspekte für ein produktionsreifes Deployment ab. Wählen Sie die Methode, die am besten zu Ihrer Infrastruktur passt.
