from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # autorise les requêtes cross-origin

# 📦 Charge le modèle entraîné (ex: butterfly_model.h5 dans le même dossier)
model = tf.keras.models.load_model("butterfly_model.h5")

# 🧠 Définir l’ordre exact des features attendu par le modèle
FEATURE_COLUMNS = [
    "distanceKm",
    "daysSinceIncident",
    "hourOfDay",
    "userEngagementRate",
    "userNumFriends",
    "userConnections",
    "urgencyScore",
    "dayOfWeek",
    "isWeekend",  # 0 ou 1
    # Encodage simple pour userType, incidentType, incidentZoneType (one-hot ou label encoded)
    "userType_Local", "userType_Tourist",
    "incidentType_Agression", "incidentType_Vol", "incidentType_Objet Perdu",
    "incidentZoneType_touristic", "incidentZoneType_business", "incidentZoneType_residential",
    "incidentZoneType_suburbs", "incidentZoneType_nightlife"
]

def encode_features(data):
    # Numériques de base
    values = [
        data["distanceKm"],
        data["daysSinceIncident"],
        data["hourOfDay"],
        data["userEngagementRate"],
        data["userNumFriends"],
        data["userConnections"],
        data["urgencyScore"],
        data["dayOfWeek"],
        1 if data["isWeekend"] else 0
    ]

    # Encodages one-hot manuels (adaptés au modèle)
    def one_hot(value, categories):
        return [1 if value == cat else 0 for cat in categories]

    # Ajout de features one-hot encodées
    values += one_hot(data["userType"], ["Local", "Tourist"])
    values += one_hot(data["incidentType"], ["Agression", "Vol", "Objet Perdu"])
    values += one_hot(data["incidentZoneType"], ["touristic", "business", "residential", "suburbs", "nightlife"])

    return np.array(values).reshape(1, -1)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        features = encode_features(data)
        prediction = model.predict(features)[0][0]  # Probabilité
        return jsonify({"probability": float(prediction)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
