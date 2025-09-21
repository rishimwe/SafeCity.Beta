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

Dans la racine du projet, lancez :

npm install

text

Cette commande installe toutes les dépendances listées dans `package.json`.  
Les principales comprennent :  
- `@tanstack/react-query`  
- `axios`  
- `react` et `react-dom`  
- `wouter`  
- `typescript`  
- `vite`  
- et autres selon votre `package.json`

---

### 2. Installer les dépendances Python

Dans le dossier `butterfly_ai/`, créez ou modifiez le fichier `requirements.txt` ainsi :

flask
tensorflow
pandas
seaborn
matplotlib
scikit-learn
numpy

text

Ensuite, installez-les via :

pip install -r butterfly_ai/requirements.txt

text

---

### 3. Lancer le serveur ML Python

Depuis le dossier `butterfly_ai/` :

cd butterfly_ai
python ml_server.py

text

Le serveur Flask sera accessible sur `http://localhost:5050` (ou port configuré).

---

### 4. Lancer le backend Node.js

Dans la racine du projet :

npm run dev

text

Le backend Express écoute sur `http://localhost:5000`.

---

### 5. Lancer le frontend React

Dans la racine du projet :

npm run start

text

Le frontend React sera accessible (souvent sur `http://localhost:3000`).

---

## 🔗 API Endpoints

### Incidents

- `GET /api/incidents` → Récupère la liste des incidents.  
- `POST /api/incidents` → Crée un incident.  
- `GET /api/incidents/:id` → Détails d’un incident.

### Butterfly AI

- `POST /api/butterfly/predict/:incidentId` → Prédiction pour un incident.  
- `POST /api/butterfly/predict-batch` → Prédictions multiples.  
- `GET /api/butterfly/recommendations` → Liste des incidents recommandés.

### SMS Alerts

- `POST /api/incidents/:id/sms-alerts` → Envoi d’une alerte SMS.  
- `GET /api/incidents/:id/sms-alerts` → Liste des SMS correspondants.

---

## 📂 Arborescence du projet (Résumé)

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

text

---

## 👨‍💻 Développement

### Langages

- Node.js, Express (Backend)  
- React, TypeScript (Frontend)  
- Python, Flask, TensorFlow (ML)

### Librairies principales

- `axios` : communication HTTP  
- `drizzle-orm` : ORM base de données PostgreSQL  
- `zod` : validation des données  
- `pandas`, `seaborn`, `matplotlib` : analyse et visualisation data  
- `scikit-learn`, `tensorflow` : apprentissage automatique  
- `react`, `@tanstack/react-query`, `wouter` : frontend React et routing  

---

N’hésitez pas à me demander en cas de besoin d’aide ou précision !
---

## ⚖️ Licence & Propriété Intellectuelle
Code écrit par **Rafik**.  
Propriété intellectuelle de **SafeCity 2025 – Lisboa**.  
Tous droits réservés.  
