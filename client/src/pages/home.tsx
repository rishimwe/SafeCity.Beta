import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import AppHeader from "@/components/layout/app-header";
import FilterSidebar from "@/components/sidebar/filter-sidebar";
import MapContainer from "@/components/map/map-container";
import IncidentDetailsPanel from "@/components/incident/incident-details-panel";
import ReportModal from "@/components/incident/report-modal";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import MobileFilterSheet from "@/components/mobile/mobile-filter-sheet";
import type { IncidentFilters } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const fakeIncidents = [
  {
    id: "1",
    title: "Vol suspecté dans le centre-ville",
    type: "theft",
    location: "Lisbonne",
    createdAt: new Date(new Date().getTime() - 3600 * 1000).toISOString(), // il y a 1h
  },
  {
    id: "2",
    title: "Agression reportée près du parc",
    type: "danger",
    location: "Lisbonne",
    createdAt: new Date(new Date().getTime() - 2 * 3600 * 1000).toISOString(), // il y a 2h
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  const isMobile = useIsMobile();

  const [selectedLanguage, setSelectedLanguage] = useState("fr");
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<IncidentFilters>({
    types: ["theft", "danger"],
    timeFilter: "week",
    severity: [],
    searchQuery: "",
  });
  const [isFilterSidebarVisible, setFilterSidebarVisible] = useState(false);

  const updateFilters = (newFilters: Partial<IncidentFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        onOpenReport={() => setIsReportModalOpen(true)}
      />
      <div className="fixed top-20 right-4 z-50">
        <Button
          onClick={() => setFilterSidebarVisible((v) => !v)}
          size="sm"
          variant="default"
        >
          {isFilterSidebarVisible ? "Masquer filtres" : "Afficher filtres"}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row h-screen pt-16">
        {/* Sidebar avec largeur fixe */}
        {!isMobile && isFilterSidebarVisible && (
          <FilterSidebar
            className="w-80 flex-shrink-0"
            filters={filters}
            onFiltersChange={updateFilters}
            onIncidentSelect={(id) => {
              setSelectedIncidentId(id);
              setFilterSidebarVisible(false);
            }}
            incidents={fakeIncidents}
            visible={isFilterSidebarVisible}
            onClose={() => setFilterSidebarVisible(false)}
            isMobile={isMobile}
          />
        )}

        {/* Map prend tout l'espace disponible */}
        <MapContainer
          className="flex-grow"
          filters={filters}
          selectedIncidentId={selectedIncidentId}
          onIncidentSelect={setSelectedIncidentId}
          onOpenReport={() => setIsReportModalOpen(true)}
          incidents={fakeIncidents}
        />

        {/* Panneau détails avec largeur fixe */}
        {!isMobile && selectedIncidentId && (
          <IncidentDetailsPanel
            className="w-96 flex-shrink-0"
            incidentId={selectedIncidentId}
            onClose={() => setSelectedIncidentId(null)}
          />
        )}
      </div>

      {isMobile && (
        <MobileBottomNav onOpenFilters={() => setIsMobileFiltersOpen(true)} />
      )}

      {isMobile && (
        <MobileFilterSheet
          isOpen={isMobileFiltersOpen}
          onClose={() => setIsMobileFiltersOpen(false)}
          filters={filters}
          onFiltersChange={updateFilters}
        />
      )}

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
