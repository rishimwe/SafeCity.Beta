# SafeCity.Beta

# 🦋 Butterfly AI – SafeCity Lisboa 2025

Write by Rafik no copyright allow 

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
