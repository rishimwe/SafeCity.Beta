import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// --- VOS VARIABLES ET IMPORTS ---
// Assurez-vous que votre variable d'environnement VITE_GOOGLE_API est correctement configurée dans votre fichier .env.local
const mySecret = import.meta.env.VITE_GOOGLE_API;
const Maps_API_KEY = mySecret;

// --- FONCTION DE CHARGEMENT GOOGLE MAPS ---
// Cette fonction charge le script de l'API Google Maps et l'ajoute à la page.
const loadGoogleMapsApi = (callback) => {
    if (Maps_API_KEY === "VOTRE_CLE_API_Maps" || !Maps_API_KEY) {
        console.error("ERREUR : Clé API Google Maps non configurée. Veuillez remplacer 'VOTRE_CLE_API_Maps' dans le code par votre propre clé API ou configurer la variable d'environnement.");
        return;
    }
    const existingScript = document.getElementById('googleMapsApi');
    if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${Maps_API_KEY}&libraries=places,geocoding`;
        script.id = 'googleMapsApi';
        document.body.appendChild(script);
        script.onload = () => {
            if (callback) callback();
        };
        script.onerror = () => {
            console.error("Erreur lors du chargement du script Google Maps. Vérifiez votre clé API et ses restrictions.");
        };
    }
    if (existingScript && callback) callback();
};

// --- CONFIGURATION DES INCIDENTS ---
const INCIDENT_TYPES = {
    'Vol': { color: '#EF4444', severity: 'medium', severityColor: 'text-yellow-400' },
    'Agression': { color: '#DC2626', severity: 'high', severityColor: 'text-red-500' },
    'Vandalisme': { color: '#EAB308', severity: 'low', severityColor: 'text-green-400' },
    'Autre': { color: '#A78BFA', severity: 'Non définie', severityColor: 'text-gray-400' }
};

// --- STYLES DE LA CARTE GOOGLE (Thème sombre) ---
const GOOGLE_MAP_STYLES = [ { "elementType": "geometry", "stylers": [ { "color": "#242f3e" } ] }, { "elementType": "labels.text.fill", "stylers": [ { "color": "#746855" } ] }, { "elementType": "labels.text.stroke", "stylers": [ { "color": "#242f3e" } ] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [ { "color": "#d59563" } ] }, { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [ { "color": "#d59563" } ] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#263c3f" } ] }, { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#6b9a76" } ] }, { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#38414e" } ] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [ { "color": "#212a37" } ] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [ { "color": "#9ca5b3" } ] }, { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#746855" } ] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "color": "#1f2835" } ] }, { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [ { "color": "#f3d19c" } ] }, { "featureType": "transit", "elementType": "geometry", "stylers": [ { "color": "#2f3948" } ] }, { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [ { "color": "#d59563" } ] }, { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#17263c" } ] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [ { "color": "#515c6d" } ] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [ { "color": "#17263c" } ] } ];

// --- COMPOSANT D'ICÔNES SVG ---
const Icon = ({ path, className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {path}
    </svg>
);
const ICONS = {
    time: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    location: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></>,
    severity: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    expand: <><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></>,
    close: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    warning: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>
};

// --- COMPOSANT CARTE (GOOGLE MAPS) ---
const MapContainer = ({ incidents, onSelectIncident, selectedIncidentId, activeFilters }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef({});
    const [isApiLoaded, setIsApiLoaded] = useState(!!window.google?.maps);

    useEffect(() => {
        if (!isApiLoaded) {
            loadGoogleMapsApi(() => setIsApiLoaded(true));
        }
    }, [isApiLoaded]);

    useEffect(() => {
        if (isApiLoaded && mapContainerRef.current && !mapRef.current) {
            const lisbonCoords = { lat: 38.7223, lng: -9.1393 };
            const map = new window.google.maps.Map(mapContainerRef.current, {
                center: lisbonCoords,
                zoom: 14,
                disableDefaultUI: true,
                zoomControl: true,
                zoomControlOptions: {
                    position: window.google.maps.ControlPosition.RIGHT_TOP,
                },
                styles: GOOGLE_MAP_STYLES,
            });
            mapRef.current = map;
        }
    }, [isApiLoaded]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !isApiLoaded) return;

        Object.values(markersRef.current).forEach(marker => marker.setMap(null));
        markersRef.current = {};

        incidents.forEach(incident => {
            const isVisible = activeFilters.size === 0 || activeFilters.has(incident.type);
            if (!isVisible) return;

            const isSelected = incident.id === selectedIncidentId;

            const marker = new window.google.maps.Marker({
                position: { lat: incident.lat, lng: incident.lng },
                map: map,
                title: incident.title,
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: incident.color,
                    fillOpacity: isSelected ? 0.9 : 0.7,
                    strokeColor: incident.color,
                    strokeWeight: isSelected ? 2 : 0,
                    scale: isSelected ? 10 : 6,
                },
                zIndex: isSelected ? 100 : 1,
            });

            marker.addListener('click', () => {
                onSelectIncident(incident.id);
            });

            markersRef.current[incident.id] = marker;
        });

        const selectedIncident = incidents.find(inc => inc.id === selectedIncidentId);
        if (selectedIncident) {
            map.panTo({ lat: selectedIncident.lat, lng: selectedIncident.lng });
            if (map.getZoom() < 15) {
                map.setZoom(16);
            }
        }

    }, [incidents, onSelectIncident, selectedIncidentId, activeFilters, isApiLoaded]);

    if (!isApiLoaded) {
        return (
             <div className="w-full h-full flex items-center justify-center bg-slate-900">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return <div ref={mapContainerRef} className="w-full h-full bg-slate-900" />;
};


// --- MODAL DE SIGNALEMENT (Google Maps) ---
const ReportIncidentModal = ({ isOpen, onClose, onAddIncident }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('Vol');
    const [address, setAddress] = useState('');
    const [position, setPosition] = useState(null);
    const [error, setError] = useState('');
    const [isApiLoaded, setIsApiLoaded] = useState(!!window.google?.maps?.places);
    const [isApiLoading, setIsApiLoading] = useState(false);

    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const searchInputRef = useRef(null);
    const autocompleteRef = useRef(null);

    const isApiKeyMissing = Maps_API_KEY === "VOTRE_CLE_API_Maps" || !Maps_API_KEY;

    useEffect(() => {
        if (isOpen && !isApiLoaded && !isApiLoading && !isApiKeyMissing) {
            setIsApiLoading(true);
            loadGoogleMapsApi(() => {
                setIsApiLoaded(true);
                setIsApiLoading(false);
            });
        }
    }, [isOpen, isApiLoaded, isApiLoading, isApiKeyMissing]);

    const setupMapAndAutocomplete = useCallback(() => {
        if (!isApiLoaded || !searchInputRef.current || mapRef.current) return;

        const lisbonCoords = { lat: 38.7223, lng: -9.1393 };

        const map = new window.google.maps.Map(document.getElementById('report-map-gmaps'), {
            center: lisbonCoords,
            zoom: 13,
            disableDefaultUI: true,
            zoomControl: true,
            styles: GOOGLE_MAP_STYLES
        });
        mapRef.current = map;

        map.addListener('click', (e) => handleLocationSelect(e.latLng));

        const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
            types: ['geocode'],
            componentRestrictions: { country: 'pt' },
        });
        autocompleteRef.current = autocomplete;
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
                handleLocationSelect(place.geometry.location, place.formatted_address);
            }
        });
    }, [isApiLoaded]);

    useEffect(() => {
        if (isOpen && isApiLoaded) {
            setupMapAndAutocomplete();
        }
    }, [isOpen, isApiLoaded, setupMapAndAutocomplete]);

    const handleLocationSelect = (latLng, formattedAddress = null) => {
        if (!mapRef.current) return;
        mapRef.current.panTo(latLng);
        mapRef.current.setZoom(16);
        if (!markerRef.current) {
            markerRef.current = new window.google.maps.Marker({
                position: latLng,
                map: mapRef.current,
                draggable: true,
                animation: window.google.maps.Animation.DROP,
            });
            markerRef.current.addListener('dragend', (e) => handleLocationSelect(e.latLng));
        } else {
            markerRef.current.setPosition(latLng);
        }
        const newPosition = { lat: latLng.lat(), lng: latLng.lng() };
        setPosition(newPosition);
        if (formattedAddress) {
            setAddress(formattedAddress);
        } else {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: latLng }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    setAddress(results[0].formatted_address);
                }
            });
        }
    };

    const handleClose = () => {
        setTitle(''); setType('Vol'); setAddress(''); setPosition(null); setError('');
        if (autocompleteRef.current) {
            window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
        mapRef.current = null; markerRef.current = null; autocompleteRef.current = null;
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isApiKeyMissing) {
            setError("Veuillez configurer votre clé API Google Maps.");
            return;
        }
        if (!title || !type || !address || !position) {
            setError('Veuillez remplir tous les champs et sélectionner un lieu.');
            return;
        }
        const newIncidentData = { type, title, location: address, latitude: position.lat.toString(), longitude: position.lng.toString(), severity: INCIDENT_TYPES[type].severity, description: "Description par défaut", isAnonymous: 0, date: new Date().toLocaleDateString('fr-FR'), time: new Date().toLocaleTimeString('fr-FR'), };
        try {
            await onAddIncident(newIncidentData);
            handleClose();
        } catch (submitError) {
            setError("Erreur lors de l'ajout du signalement.");
            console.error("Erreur d'envoi de l'incident:", submitError);
        }
    };

    if (!isOpen) return null;

    const renderContent = () => {
        if (isApiKeyMissing) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Icon path={ICONS.warning} className="h-12 w-12 text-red-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">Clé API manquante</h3>
                    <p className="text-gray-400">Veuillez configurer votre clé API Google Maps dans le code pour utiliser cette fonctionnalité.</p>
                </div>
            );
        }
        if (isApiLoading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }
        if (isApiLoaded) {
            return (
                <>
                    <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Titre</label>
                            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="block w-full px-3 py-2 bg-black/20 border border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm text-white transition" placeholder="Ex: Vol de sac à main" />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1">Nature</label>
                            <select id="type" value={type} onChange={(e) => setType(e.target.value)} className="block w-full pl-3 pr-10 py-2 bg-black/20 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm rounded-lg text-white transition">
                                {Object.keys(INCIDENT_TYPES).map(key => <option key={key} value={key}>{key}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="location-gmaps" className="block text-sm font-medium text-gray-300 mb-1">Adresse</label>
                            <input ref={searchInputRef} type="text" id="location-gmaps" value={address} onChange={(e) => setAddress(e.target.value)} className="block w-full px-3 py-2 bg-black/20 border border-slate-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm text-white transition" placeholder="Rechercher ou cliquer sur la carte..." />
                        </div>
                        <div className="h-64 md:h-80 w-full bg-slate-900 rounded-lg" id="report-map-gmaps"></div>
                        <p className="text-xs text-gray-500 text-center mt-1">Cliquez ou glissez-déposez le marqueur pour ajuster la position.</p>
                    </form>
                    <div className="mt-6 flex justify-end space-x-3 shrink-0 pt-5">
                        {error && <p className="text-red-400 text-sm self-center mr-auto">{error}</p>}
                        <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-200 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">Annuler</button>
                        <button type="button" onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors">Ajouter le signalement</button>
                    </div>
                </>
            );
        }
        return null;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 text-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 shrink-0">
                    <h2 className="text-xl font-bold text-gray-100">Signaler un incident</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                        <Icon path={ICONS.close} className="h-6 w-6" />
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

// --- WIDGET DE SIGNALEMENT ---
const ReportIncidentWidget = ({ onAddIncident }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="w-full">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full flex items-center justify-center p-4 bg-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-indigo-500/40 transition-all transform hover:scale-[1.02] hover:bg-indigo-500 active:scale-[1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500"
                >
                    <Icon path={ICONS.plus} className="h-6 w-6 mr-3" />
                    <span className="text-lg font-semibold tracking-wide">Nouveau Signalement</span>
                </button>
            </div>
            <ReportIncidentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddIncident={onAddIncident}
            />
        </>
    );
};

// --- COMPOSANT PRINCIPAL ---
export default function IncidentMapWidget() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedIncidentId, setSelectedIncidentId] = useState(null);
    const [activeFilters, setActiveFilters] = useState(new Set());
    const [expandedView, setExpandedView] = useState('none');

    useEffect(() => {
        const fetchRecentIncidents = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/incidents'); 
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des incidents');
                }
                const data = await response.json();

                const enrichedData = data.map(incident => ({
                    ...incident,
                    color: INCIDENT_TYPES[incident.type]?.color || '#F59E0B',
                    severityColor: INCIDENT_TYPES[incident.type]?.severityColor || 'text-gray-400',
                    lat: parseFloat(incident.latitude),
                    lng: parseFloat(incident.longitude),
                }));

                setIncidents(enrichedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentIncidents();
    }, []);

    const handleAddIncident = async (newIncidentData) => {
        try {
            const response = await fetch('/api/incidents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newIncidentData),
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Erreur réseau ou du serveur: ${errorBody}`);
            }

            const createdIncident = await response.json();

            const incidentWithRenderData = {
                ...createdIncident,
                color: INCIDENT_TYPES[createdIncident.type]?.color || '#cccccc',
                severityColor: INCIDENT_TYPES[createdIncident.type]?.severityColor || 'text-gray-400',
                lat: parseFloat(createdIncident.latitude),
                lng: parseFloat(createdIncident.longitude),
            };

            setIncidents(prevIncidents => [incidentWithRenderData, ...prevIncidents].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            setSelectedIncidentId(incidentWithRenderData.id);

        } catch (submitError) {
            console.error("Erreur d'envoi de l'incident:", submitError);
            throw submitError;
        }
    };

    const incidentTypes = useMemo(() => {
        const typesInConfig = Object.keys(INCIDENT_TYPES);
        const typesInData = new Set(incidents.map(inc => inc.type));
        return typesInConfig.filter(type => typesInData.has(type));
    }, [incidents]);

    const selectedIncident = useMemo(() => incidents.find(inc => inc.id === selectedIncidentId) || null, [selectedIncidentId, incidents]);

    const handleToggleFilter = (type) => {
        setActiveFilters(prevFilters => {
            const newFilters = new Set(prevFilters);
            if (newFilters.has(type)) {
                newFilters.delete(type);
            } else {
                newFilters.add(type);
            }
            if (selectedIncident && !newFilters.has(selectedIncident.type) && newFilters.size > 0) {
                setSelectedIncidentId(null);
            }
            return newFilters;
        });
    };
    const handleResetFilters = () => setActiveFilters(new Set());

    const ViewportButton = ({ target }) => {
        const isExpanded = expandedView === target;
        const isHidden = expandedView !== 'none' && !isExpanded;
        if (isHidden) return null;
        return (
            <button
                onClick={() => setExpandedView(isExpanded ? 'none' : target)}
                className="absolute bottom-4 right-4 z-10 bg-slate-900/50 backdrop-blur-sm text-white p-2 rounded-full shadow-lg hover:bg-slate-900/80 hover:scale-110 active:scale-100 transition-all"
                aria-label={isExpanded ? "Réduire la vue" : "Agrandir la vue"}
            >
                <Icon path={isExpanded ? ICONS.close : ICONS.expand} className="h-5 w-5" />
            </button>
        );
    };

    return (
        <div className="bg-slate-900 p-4 sm:p-6 flex items-center justify-center min-h-screen font-sans text-white">
            <div className="w-full max-w-7xl flex flex-col">
                <div className="bg-slate-800/30 backdrop-blur-2xl shadow-2xl shadow-black/20 rounded-3xl overflow-hidden flex flex-col relative" style={{ height: '80vh', maxHeight: '900px' }}>
                    <header className="bg-black/20 p-5 shrink-0 z-10 relative">
                        <h1 className="text-xl font-bold text-gray-100">SafeCity Dashboard</h1>
                        <div className="flex items-center flex-wrap gap-2 mt-4">
                            <span className="text-sm font-medium text-gray-400 mr-2">Filtres:</span>
                            {incidentTypes.map(type => {
                                const isActive = activeFilters.has(type);
                                const color = INCIDENT_TYPES[type]?.color || '#cccccc';
                                return (
                                    <button key={type} onClick={() => handleToggleFilter(type)} className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 border border-transparent ${isActive ? 'text-white shadow-md' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`} style={isActive ? { backgroundColor: color, borderColor: color, boxShadow: `0 0 15px -1px ${color}60` } : {}}>
                                        {type}
                                    </button>
                                );
                            })}
                            {activeFilters.size > 0 && <button onClick={handleResetFilters} className="text-xs text-indigo-400 hover:underline ml-2">Réinitialiser</button>}
                        </div>
                    </header>

                    <main className="flex-grow flex overflow-hidden relative z-0">
                        <div className={`transition-all duration-500 ease-in-out relative h-full ${expandedView === 'map' ? 'w-full' : expandedView === 'details' ? 'w-0 opacity-0' : 'w-full md:w-2/3'}`}>
                            {loading ? (
                                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : error ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-center p-4">
                                    <Icon path={ICONS.warning} className="h-10 w-10 text-red-400 mb-4" />
                                    <p className="text-red-400 font-semibold">Impossible de charger les incidents.</p>
                                    <p className="text-gray-400 text-sm mt-1">{error}</p>
                                </div>
                            ) : (
                                <MapContainer incidents={incidents} onSelectIncident={setSelectedIncidentId} selectedIncidentId={selectedIncidentId} activeFilters={activeFilters} />
                            )}
                            <ViewportButton target="map" />
                        </div>
                        <aside className={`transition-all duration-500 ease-in-out relative h-full bg-black/20 backdrop-blur-sm ${expandedView === 'details' ? 'w-full' : expandedView === 'map' ? 'w-0 opacity-0' : 'w-full md:w-1/3'}`}>
                            {selectedIncident ? (
                                <div className="p-6 h-full overflow-y-auto">
                                    <div className="flex items-center mb-4">
                                        <span className="text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ color: 'white', backgroundColor: selectedIncident.color }}>{selectedIncident.type}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-100 mb-6">{selectedIncident.title || 'Titre non disponible'}</h2>
                                    <div className="space-y-6 text-sm text-gray-300">
                                        <div className="flex items-start"><Icon path={ICONS.time} className="h-5 w-5 mr-4 mt-1 shrink-0 text-indigo-400" /><div><p className="font-semibold text-gray-100">Date et Heure</p><p>{new Date(selectedIncident.createdAt).toLocaleString('fr-FR') || 'Non spécifié'}</p></div></div>
                                        <div className="flex items-start"><Icon path={ICONS.location} className="h-5 w-5 mr-4 mt-1 shrink-0 text-indigo-400" /><div><p className="font-semibold text-gray-100">Localisation</p><p>{selectedIncident.location || 'Non spécifiée'}</p></div></div>
                                        <div className="flex items-start"><Icon path={ICONS.severity} className="h-5 w-5 mr-4 mt-1 shrink-0 text-indigo-400" /><div><p className="font-semibold text-gray-100">Sévérité</p><p className={`font-bold ${selectedIncident.severityColor || 'text-gray-400'}`}>{selectedIncident.severity || 'Non spécifiée'}</p></div></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <p className="text-gray-500 text-sm">Cliquez sur un incident sur la carte pour voir les détails.</p>
                                </div>
                            )}
                            <ViewportButton target="details" />
                        </aside>
                    </main>
                </div>
                <div className="mt-6">
                    <ReportIncidentWidget onAddIncident={handleAddIncident} />
                </div>
            </div>
        </div>
    );
}