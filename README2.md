# 🦋 Butterfly AI – SafeCity Lisboa

## 📖 Présentation
Butterfly AI est un projet développé pour **SafeCity 2025 – Lisboa**.  
Il s’agit d’une plateforme de **sécurité urbaine intelligente** qui permet :

- 📌 La collecte et la gestion d’incidents signalés par les citoyens.  
- 🗨️ L’ajout de **commentaires** et **évaluations** sur chaque incident.  
- 📲 L’envoi d’**alertes SMS intelligentes** (objet retrouvé, suspect aperçu, etc.).  
- 🤖 L’intégration d’un module **d’intelligence artificielle** (*Butterfly AI*) pour prédire la pertinence des incidents selon le profil utilisateur.  

---

## 🚀 Fonctionnalités principales
- **Backend Node.js / Express**  
  - Gestion des incidents (CRUD).  
  - Système de commentaires et de notes.  
  - API pour les alertes SMS.  
  - API Butterfly AI (prédictions et recommandations).  

- **Frontend React/TypeScript**  
  - Affichage de la carte des incidents.  
  - Filtrage par type, gravité, et temps.  
  - Recommandations personnalisées.  

- **Module Machine Learning (Python – Flask + TensorFlow)**  
  - Service externe (`ml_server.py`) pour calculer les prédictions.  
  - Communication avec Node.js via requêtes HTTP (`axios`).  

---

## 🛠️ Installation & Lancement

### 1. Installer les dépendances Node.js
```bash
npm install
```

### 2. Installer les dépendances Python
Dans le dossier `butterfly_ai/`, créer ou modifier `requirements.txt` :

```
flask
tensorflow
```

Puis installer :
```bash
pip install -r requirements.txt
```

### 3. Lancer le serveur ML (Python)
```bash
cd butterfly_ai
python ml_server.py
```

Le serveur Flask sera accessible sur `http://localhost:5000`.

### 4. Lancer le backend Node.js
```bash
npm run dev
```

### 5. Lancer le frontend React
```bash
npm run start
```

---

## 🔗 API Endpoints

### Incidents
- `GET /api/incidents` → Liste les incidents.  
- `POST /api/incidents` → Crée un incident.  
- `GET /api/incidents/:id` → Détails d’un incident.  

### Butterfly AI
- `POST /api/butterfly/predict/:incidentId` → Prédiction pour un incident.  
- `POST /api/butterfly/predict-batch` → Prédictions multiples.  
- `GET /api/butterfly/recommendations` → Incidents recommandés.  

### SMS Alerts
- `POST /api/incidents/:id/sms-alerts` → Envoi d’une alerte SMS.  
- `GET /api/incidents/:id/sms-alerts` → Liste des SMS liés à un incident.  

---

## 📂 Arborescence du projet

```
📦 SafeCity-ButterflyAI
 ┣ 📂 butterfly_ai/          # Service ML (Flask + TensorFlow)
 ┃ ┣ 📜 ml_server.py
 ┃ ┣ 📜 requirements.txt
 ┣ 📂 src/                   # Code Node.js / Express
 ┃ ┣ 📜 routes.ts
 ┃ ┣ 📜 butterflyPredictionService.ts
 ┣ 📂 frontend/              # React / TypeScript
 ┃ ┣ 📜 App.tsx
 ┣ 📜 package.json
 ┣ 📜 README.md
```

---

## 👨‍💻 Développement

- **Langages utilisés** :  
  - Node.js, Express (Backend)  
  - React, TypeScript (Frontend)  
  - Python, Flask, TensorFlow (Machine Learning)  

- **Librairies clés** :  
  - `axios` (communication Node.js → Flask)  
  - `drizzle-orm` (ORM base de données)  
  - `zod` (validation schémas)  

---

## ⚖️ Licence & Propriété Intellectuelle
Code écrit par **Rafik**.  
Propriété intellectuelle de **SafeCity 2025 – Lisboa**.  
Tous droits réservés.  
