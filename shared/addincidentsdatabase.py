import psycopg2
import json
import os
# Remplace 'ton_url_de_connexion_neom' par l'URL de ta base de données Neom
conn_string = "postgresql://neondb_owner:npg_kuG7sZCVv9PQ@ep-cool-mode-a970csv9-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require"

# Voici la liste des incidents générés précédemment
incidents = [
  {
    "id": "e4b6c3d1-a7f8-4e92-8c05-5f12e8b0a9d4",
    "type": "theft",
    "title": "Vol de sac à dos près du Château de São Jorge",
    "description": "Un touriste s'est fait voler son sac à dos contenant des documents et son portefeuille alors qu'il prenait des photos. L'incident a eu lieu dans une ruelle très fréquentée.",
    "location": "Rua do Recolhimento, Lisbonne",
    "latitude": "38.7139",
    "longitude": "-9.1325",
    "severity": "medium",
    "date": "2025-08-04",
    "time": "15:30",
    "is_anonymous": 0,
    "reported_by": "utilisateur123",
    "created_at": "2025-08-05T09:00:00Z"
  },
  {
    "id": "f5a7d9b2-c8e6-4f10-9c21-6b04a1c5d3e7",
    "type": "danger",
    "title": "Glissement de terrain sur une colline escarpée",
    "description": "De fortes pluies ont provoqué un petit glissement de terrain sur un sentier piétonnier, rendant la zone dangereuse pour la circulation. Les autorités ont fermé l'accès.",
    "location": "Miradouro de Santa Luzia, Alfama",
    "latitude": "38.7135",
    "longitude": "-9.1293",
    "severity": "high",
    "date": "2025-08-03",
    "time": "08:15",
    "is_anonymous": 1,
    "reported_by": None, # Attention en Python on utilise None pour NULL
    "created_at": "2025-08-05T09:05:00Z"
  },
  {
    "id": "c1b9a8d3-f2e7-4c01-8e94-3b2d1c5e6f7a",
    "type": "harassment",
    "title": "Harcèlement verbal à la station de métro",
    "description": "Une femme a été victime de harcèlement verbal par un groupe d'individus. Un agent de sécurité est intervenu rapidement.",
    "location": "Station de métro Rossio, Lisbonne",
    "latitude": "38.7144",
    "longitude": "-9.1394",
    "severity": "low",
    "date": "2025-08-02",
    "time": "18:45",
    "is_anonymous": 0,
    "reported_by": "victime99",
    "created_at": "2025-08-05T09:10:00Z"
  },{
        "id": "b0c8d7a4-e9f3-421c-8b65-7a4c9b1d2e3f",
        "type": "other",
        "title": "Panne d'éclairage public sur une rue principale",
        "description": "Plusieurs lampadaires ne fonctionnent pas sur l'avenue, créant des conditions de visibilité médiocres pour les piétons et les automobilistes.",
        "location": "Avenida da Liberdade, Lisbonne",
        "latitude": "38.7180",
        "longitude": "-9.1444",
        "severity": "medium",
        "date": "2025-08-01",
        "time": "21:00",
        "is_anonymous": 1,
        "reported_by": None,
        "created_at": "2025-08-05T09:15:00Z"
      },
      {
        "id": "a9d7c6b5-f8e1-432a-8d76-9c8b0a1d2e3f",
        "type": "theft",
        "title": "Vol de téléphone dans un café très fréquenté",
        "description": "Un client s'est fait dérober son téléphone portable alors qu'il était posé sur la table. Le voleur a profité d'un moment d'inattention.",
        "location": "Baixa-Chiado, Lisbonne",
        "latitude": "38.7107",
        "longitude": "-9.1392",
        "severity": "medium",
        "date": "2025-07-31",
        "time": "12:00",
        "is_anonymous": 0,
        "reported_by": "clientcafe",
        "created_at": "2025-08-05T09:20:00Z"
      },
      {
        "id": "b8a6d5c7-e9f2-412b-8a65-7d4c9b0a1d2e",
        "type": "danger",
        "title": "Incendie dans un immeuble résidentiel",
        "description": "Un petit incendie s'est déclaré dans un appartement du premier étage. Les pompiers sont intervenus et ont rapidement maîtrisé le feu. Pas de blessés graves.",
        "location": "Rua Augusta, Lisbonne",
        "latitude": "38.7099",
        "longitude": "-9.1368",
        "severity": "high",
        "date": "2025-07-30",
        "time": "04:30",
        "is_anonymous": 1,
        "reported_by": None,
        "created_at": "2025-08-05T09:25:00Z"
      },
      {
        "id": "a7b5d3c8-e2f9-4d1a-8c64-7b4a9c0d1e2f",
        "type": "harassment",
        "title": "Harcèlement de rue dans une zone touristique",
        "description": "Plusieurs touristes ont rapporté avoir été harcelés par des vendeurs de rue agressifs. La police a été appelée pour intervenir.",
        "location": "Praça do Comércio, Lisbonne",
        "latitude": "38.7070",
        "longitude": "-9.1365",
        "severity": "low",
        "date": "2025-07-29",
        "time": "14:00",
        "is_anonymous": 0,
        "reported_by": "touriste567",
        "created_at": "2025-08-05T09:30:00Z"
      },
      {
        "id": "f6a8e1d3-b2c7-4a9f-8e34-5d2a6b0c1e4f",
        "type": "other",
        "title": "Fuite d'eau importante sur la chaussée",
        "description": "Une canalisation d'eau a éclaté, provoquant une inondation mineure sur une rue. Les services municipaux ont été informés pour effectuer les réparations.",
        "location": "Cais do Sodré, Lisbonne",
        "latitude": "38.7077",
        "longitude": "-9.1444",
        "severity": "medium",
        "date": "2025-07-28",
        "time": "10:00",
        "is_anonymous": 1,
        "reported_by": None,
        "created_at": "2025-08-05T09:35:00Z"
      },
      {
        "id": "e5c7a9b1-d3f2-4e0c-9f87-6a4d5b2c3f1e",
        "type": "theft",
        "title": "Vol à la tire dans le tram 28",
        "description": "Un touriste s'est fait voler son portefeuille dans le tram 28, très fréquenté. L'incident s'est produit au moment où le tram s'est arrêté.",
        "location": "Tram 28, près de Graca, Lisbonne",
        "latitude": "38.7180",
        "longitude": "-9.1275",
        "severity": "medium",
        "date": "2025-07-27",
        "time": "16:00",
        "is_anonymous": 0,
        "reported_by": "tram_voyageur",
        "created_at": "2025-08-05T09:40:00Z"
      },
      {
        "id": "d4a6c8b2-e1f9-4d1a-8c75-6a5b4c3e2f1d",
        "type": "danger",
        "title": "Route bloquée par un arbre tombé",
        "description": "Un grand arbre est tombé sur la route après une tempête de vent, bloquant complètement la circulation. Les pompiers sont sur place pour dégager la route.",
        "location": "Parc forestier de Monsanto, Lisbonne",
        "latitude": "38.7291",
        "longitude": "-9.1912",
        "severity": "high",
        "date": "2025-07-26",
        "time": "06:00",
        "is_anonymous": 1,
        "reported_by": None,
        "created_at": "2025-08-05T09:45:00Z"
      }
  # ... Ajoute les 32 autres incidents ici ...
]

try:
    # Connexion à la base de données Neom
    conn = psycopg2.connect(conn_string)
    cur = conn.cursor()

    # Définition de la requête SQL d'insertion
    sql = """
    INSERT INTO incidents (
        id, type, title, description, location, latitude, longitude, severity, date, time, isAnonymous, reportedBy, createdAt
    ) VALUES (
        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
    )
    """

    # Boucle sur la liste des incidents pour les insérer un par un
    for incident in incidents:
        # Préparation des données pour l'insertion
        data = (
            incident['id'],
            incident['type'],
            incident['title'],
            incident['description'],
            incident['location'],
            incident['latitude'],
            incident['longitude'],
            incident['severity'],
            incident['date'],
            incident['time'],
            incident['isAnonymous'],
            incident['reportedBy'],
            incident['createdAt']
        )
        # Exécution de la requête
        cur.execute(sql, data)

    # Validation des changements
    conn.commit()
    print(f"{len(incidents)} incidents ont été insérés avec succès dans la base de données.")

except (Exception, psycopg2.Error) as error:
    print("Erreur lors de la connexion ou de l'insertion :", error)
finally:
    # Fermeture de la connexion
    if conn:
        cur.close()
        conn.close()
        print("La connexion à la base de données est fermée.")
