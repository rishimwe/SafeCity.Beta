import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useIncidents } from "@/hooks/use-incidents";
import type { IncidentFilters } from "@/lib/types";
import { INCIDENT_TYPES, SEVERITY_LEVELS, TIME_FILTERS } from "@/lib/types";

interface FilterSidebarProps {
  filters: IncidentFilters;
  onFiltersChange: (filters: Partial<IncidentFilters>) => void;
  onIncidentSelect: (id: string) => void;
  visible: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

export default function FilterSidebar({
  filters,
  onFiltersChange,
  onIncidentSelect,
  visible,
  onClose,
  isMobile = false,
}: FilterSidebarProps) {
  const { data: incidents = [], isLoading } = useIncidents(filters);

  if (!visible) return null;

  const handleTypeToggle = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.types, type]
      : filters.types.filter((t) => t !== type);
    onFiltersChange({ types: newTypes });
  };

  const handleSeverityToggle = (severity: string, checked: boolean) => {
    const newSeverity = checked
      ? [...filters.severity, severity]
      : filters.severity.filter((s) => s !== severity);
    onFiltersChange({ severity: newSeverity });
  };

  const formatTimeAgo = (dateString: string) => {
    const dateObject = new Date(dateString);
    if (isNaN(dateObject.getTime())) {
      return "Date invalide";
    }
    const now = new Date();
    const diffMs = now.getTime() - dateObject.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays > 0) {
      return `Il y a ${diffDays}j`;
    } else if (diffHours > 0) {
      return `Il y a ${diffHours}h`;
    } else {
      return "Il y a moins d'1h";
    }
  };

  const getIncidentTypeConfig = (type: string) => {
    return INCIDENT_TYPES.find((t) => t.key === type) || INCIDENT_TYPES[3];
  };

  const getIncidentCount = (type: string) => {
    return incidents.filter((incident) => incident.type === type).length;
  };

  return (
    <aside
      className={`bg-white shadow-lg fixed top-16 left-0 bottom-0 overflow-y-auto z-40
        ${isMobile ? "w-full" : "lg:w-80 lg:min-h-screen"}
      `}
    >
      {/* Bouton fermer uniquement sur mobile */}
      {isMobile && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded bg-gray-200 hover:bg-gray-300"
          aria-label="Fermer la sidebar"
        >
          ✕
        </button>
      )}
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg mb-4">Filtres</h2>
        {/* Search Bar */}
        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Rechercher un lieu..."
            value={filters.searchQuery}
            onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        </div>
        {/* Incident Type Filters */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Type d'incident</h3>
          <div className="space-y-2">
            {INCIDENT_TYPES.map((type) => (
              <div key={type.key} className="flex items-center space-x-2">
                <Checkbox
                  id={type.key}
                  checked={filters.types.includes(type.key)}
                  onCheckedChange={(checked) =>
                    handleTypeToggle(type.key, checked as boolean)
                  }
                />
                <label
                  htmlFor={type.key}
                  className="flex items-center space-x-2 cursor-pointer text-sm"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  <span>
                    {type.label} ({getIncidentCount(type.key)})
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
        {/* Time Filter */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Période</h3>
          <Select
            value={filters.timeFilter}
            onValueChange={(value) => onFiltersChange({ timeFilter: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_FILTERS.map((filter) => (
                <SelectItem key={filter.key} value={filter.key}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Severity Filter */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Gravité</h3>
          <div className="flex space-x-2">
            {SEVERITY_LEVELS.map((level) => (
              <Button
                key={level.key}
                variant={
                  filters.severity.includes(level.key) ? "default" : "outline"
                }
                size="sm"
                onClick={() =>
                  handleSeverityToggle(
                    level.key,
                    !filters.severity.includes(level.key)
                  )
                }
                className="text-xs"
                style={
                  filters.severity.includes(level.key)
                    ? {
                        backgroundColor: level.color,
                        borderColor: level.color,
                        color: "white",
                      }
                    : {}
                }
              >
                {level.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Recent Incidents List */}
      <div className="p-4">
        <h3 className="font-medium mb-3">Incidents récents</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Chargement...</div>
          ) : incidents.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Aucun incident trouvé
            </div>
          ) : (
            incidents.slice(0, 10).map((incident) => {
              const typeConfig = getIncidentTypeConfig(incident.type);
              return (
                <div
                  key={incident.id}
                  className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => onIncidentSelect(incident.id)}
                >
                  <div className="flex items-start space-x-3">
                    <span
                      className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                      style={{ backgroundColor: typeConfig.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">
                        {incident.title}
                      </p>
                      <p className="text-xs text-on-surface-variant truncate">
                        {incident.location}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {formatTimeAgo(incident.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}
