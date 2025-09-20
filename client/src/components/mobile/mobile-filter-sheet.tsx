import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { IncidentFilters } from "@/lib/types";
import { INCIDENT_TYPES, SEVERITY_LEVELS } from "@/lib/types";

interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: IncidentFilters;
  onFiltersChange: (filters: Partial<IncidentFilters>) => void;
}

export default function MobileFilterSheet({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange 
}: MobileFilterSheetProps) {
  if (!isOpen) return null;

  const handleTypeToggle = (type: string, checked: boolean) => {
    const newTypes = checked 
      ? [...filters.types, type]
      : filters.types.filter(t => t !== type);
    onFiltersChange({ types: newTypes });
  };

  const handleSeverityToggle = (severity: string, checked: boolean) => {
    const newSeverity = checked 
      ? [...filters.severity, severity]
      : filters.severity.filter(s => s !== severity);
    onFiltersChange({ severity: newSeverity });
  };

  const applyFilters = () => {
    onClose();
  };

  return (
    <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-3/4 overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Filtres</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-96 custom-scrollbar">
          <div className="space-y-4">
            {/* Incident Types */}
            <div>
              <h4 className="font-medium mb-2">Type d'incident</h4>
              <div className="space-y-2">
                {INCIDENT_TYPES.map(type => (
                  <div key={type.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mobile-${type.key}`}
                      checked={filters.types.includes(type.key)}
                      onCheckedChange={(checked) => handleTypeToggle(type.key, checked as boolean)}
                    />
                    <Label htmlFor={`mobile-${type.key}`} className="flex items-center space-x-2 cursor-pointer">
                      <span 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      <span>{type.label}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div>
              <h4 className="font-medium mb-2">Gravité</h4>
              <div className="space-y-2">
                {SEVERITY_LEVELS.map(level => (
                  <div key={level.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`mobile-severity-${level.key}`}
                      checked={filters.severity.includes(level.key)}
                      onCheckedChange={(checked) => handleSeverityToggle(level.key, checked as boolean)}
                    />
                    <Label htmlFor={`mobile-severity-${level.key}`} className="cursor-pointer">
                      {level.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t">
          <Button 
            onClick={applyFilters}
            className="w-full bg-primary text-white hover:bg-primary-dark"
          >
            Appliquer les filtres
          </Button>
        </div>
      </div>
    </div>
  );
}
