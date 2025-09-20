import { useState } from "react";
import { X, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCreateIncident } from "@/hooks/use-incidents";
import { useToast } from "@/hooks/use-toast";
import { INCIDENT_TYPES, SEVERITY_LEVELS } from "@/lib/types";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const { toast } = useToast();
  const createIncidentMutation = useCreateIncident();

  const [formData, setFormData] = useState({
    type: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    severity: '',
    description: '',
    anonymous: false,
  });

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // In a real app, you would use a reverse geocoding service
            handleInputChange('location', `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          } catch (error) {
            toast({
              title: "Erreur",
              description: "Impossible d'obtenir l'adresse",
              variant: "destructive",
            });
          }
        },
        () => {
          toast({
            title: "Erreur",
            description: "Impossible d'accéder à votre localisation",
            variant: "destructive",
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type || !formData.location || !formData.severity || !formData.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    if (formData.description.length < 20) {
      toast({
        title: "Erreur",
        description: "La description doit contenir au moins 20 caractères",
        variant: "destructive",
      });
      return;
    }

    try {
      // For demo purposes, using approximate Lisbon coordinates
      const baseLatitude = 38.7223;
      const baseLongitude = -9.1393;
      const randomOffset = () => (Math.random() - 0.5) * 0.01;

      await createIncidentMutation.mutateAsync({
        type: formData.type,
        title: `${INCIDENT_TYPES.find(t => t.key === formData.type)?.label || 'Incident'}`,
        description: formData.description,
        location: formData.location,
        latitude: (baseLatitude + randomOffset()).toString(),
        longitude: (baseLongitude + randomOffset()).toString(),
        severity: formData.severity,
        date: formData.date,
        time: formData.time,
        isAnonymous: formData.anonymous ? 1 : 0,
        reportedBy: null,
      });

      toast({
        title: "Succès",
        description: "Incident signalé avec succès!",
      });

      // Reset form
      setFormData({
        type: '',
        location: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        severity: '',
        description: '',
        anonymous: false,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de signaler l'incident",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Signaler un incident</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Aidez votre communauté en signalant les incidents de sécurité
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Incident Type */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Type d'incident *</Label>
            <div className="grid grid-cols-2 gap-3">
              {INCIDENT_TYPES.map(type => (
                <label key={type.key} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="incidentType"
                    value={type.key}
                    checked={formData.type === type.key}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="sr-only peer"
                  />
                  <div className="border-2 border-gray-200 rounded-xl p-4 peer-checked:border-primary peer-checked:bg-blue-50 hover:border-gray-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <i className={`${type.icon} text-xl`} style={{ color: type.color }} />
                      <span className="font-medium">{type.label}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Localisation *</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Adresse ou nom du lieu..."
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="pl-10"
                required
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div>
            <Button
              type="button"
              variant="link"
              className="mt-2 p-0 h-auto text-primary text-sm"
              onClick={useCurrentLocation}
            >
              <MapPin className="mr-1 w-3 h-3" />
              Utiliser ma position actuelle
            </Button>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Date *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Heure (approximative) *</Label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Severity */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Gravité *</Label>
            <div className="flex space-x-3">
              {SEVERITY_LEVELS.map(level => (
                <label key={level.key} className="relative cursor-pointer flex-1">
                  <input
                    type="radio"
                    name="severity"
                    value={level.key}
                    checked={formData.severity === level.key}
                    onChange={(e) => handleInputChange('severity', e.target.value)}
                    className="sr-only peer"
                  />
                  <div 
                    className="border-2 border-gray-200 rounded-lg p-3 text-center peer-checked:border-current peer-checked:bg-opacity-10 hover:border-gray-300 transition-colors"
                    style={formData.severity === level.key ? {
                      borderColor: level.color,
                      backgroundColor: level.color + '20'
                    } : {}}
                  >
                    <span 
                      className="font-medium"
                      style={{ color: formData.severity === level.key ? level.color : undefined }}
                    >
                      {level.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Description *</Label>
            <Textarea
              placeholder="Décrivez l'incident en détail..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">Minimum 20 caractères</p>
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={formData.anonymous}
              onCheckedChange={(checked) => handleInputChange('anonymous', checked)}
            />
            <Label htmlFor="anonymous" className="text-sm cursor-pointer">
              Signaler de manière anonyme
            </Label>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-white hover:bg-primary-dark"
              disabled={createIncidentMutation.isPending}
            >
              <Send className="mr-2 h-4 w-4" />
              {createIncidentMutation.isPending ? 'Signalement...' : 'Signaler'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
