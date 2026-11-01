"use client";

import React, { useEffect, useRef, useState } from "react";
import type { PropertyListing } from "@/types/rentradar";
import type * as LeafletType from "leaflet";
import { Crosshair, Layers } from "lucide-react";

export interface RentalRadarMapProps {
  properties: PropertyListing[];
  selectedDocketId: string | null;
  onSelectProperty: (property: PropertyListing) => void;
  activeCity: "ALL" | "Dhaka" | "Sylhet" | "Chattogram";
  onCityChange: (city: "ALL" | "Dhaka" | "Sylhet" | "Chattogram") => void;
}

const CITY_COORDINATES: Record<
  "ALL" | "Dhaka" | "Sylhet" | "Chattogram",
  { coords: [number, number]; zoom: number }
> = {
  ALL: { coords: [23.8103, 90.4125], zoom: 7 },
  Dhaka: { coords: [23.7806, 90.4070], zoom: 12 },
  Sylhet: { coords: [24.8949, 91.8687], zoom: 13 },
  Chattogram: { coords: [22.3569, 91.8155], zoom: 13 },
};

function formatPinPrice(bdt: number): string {
  if (bdt >= 100000) {
    const l = (bdt / 100000).toFixed(1);
    return `৳${l.endsWith(".0") ? l.slice(0, -2) : l}L`;
  }
  const k = (bdt / 1000).toFixed(1);
  return `৳${k.endsWith(".0") ? k.slice(0, -2) : k}k`;
}

export default function RentalRadarMap({
  properties,
  selectedDocketId,
  onSelectProperty,
  activeCity,
  onCityChange,
}: RentalRadarMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletType.Map | null>(null);
  const markersLayerRef = useRef<LeafletType.LayerGroup | null>(null);
  const leafletLibRef = useRef<typeof LeafletType | null>(null);
  const initialCityRef = useRef(activeCity);
  const [isMapReady, setIsMapReady] = useState(false);

  // 1. Initialize Leaflet Map once
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!containerRef.current || mapInstanceRef.current) return;

      const L = (await import("leaflet")).default;
      if (!isMounted || !containerRef.current) return;

      leafletLibRef.current = L;

      const initialCityConfig = CITY_COORDINATES[initialCityRef.current] || CITY_COORDINATES.ALL;

      const map = L.map(containerRef.current, {
        center: initialCityConfig.coords,
        zoom: initialCityConfig.zoom,
        zoomControl: false,
        attributionControl: false,
      });

      // Sharp, fast OpenStreetMap tile server
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Re-position zoom control to bottom right
      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map);

      // Add attribution cleanly
      L.control
        .attribution({
          position: "bottomright",
          prefix: '<span class="font-mono text-[9px] uppercase tracking-wider text-muted-ink">OSM Civic Layer</span>',
        })
        .addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      setIsMapReady(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []);

  // 2. Handle City Fly-To changes
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;
    const target = CITY_COORDINATES[activeCity];
    if (target) {
      mapInstanceRef.current.flyTo(target.coords, target.zoom, {
        duration: 1.1,
        easeLinearity: 0.25,
      });
    }
  }, [activeCity, isMapReady]);

  // 3. Render Custom L.divIcon Pins whenever properties or selectedDocketId change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    const L = leafletLibRef.current;

    if (!map || !markersGroup || !L || !isMapReady) return;

    markersGroup.clearLayers();

    properties.forEach((property) => {
      const isSelected = property.docketId === selectedDocketId;
      const isHighRisk = property.riskScore >= 60;
      const isVerified = property.verificationTier !== "UNVERIFIED";
      const priceText = formatPinPrice(property.monthlyRentBdt);

      // Construct Civic Architectural Tag HTML
      let badgeStyle = "bg-surface text-carbon border-carbon shadow-[2px_2px_0px_0px_#0A0A0A]";
      let statusIndicator = "";

      if (isSelected) {
        badgeStyle =
          "bg-radar text-carbon font-bold border-carbon scale-110 shadow-[3px_3px_0px_0px_#0A0A0A] z-[1000]";
      } else if (isHighRisk) {
        badgeStyle = "bg-evidence-red text-white font-bold border-carbon shadow-[2px_2px_0px_0px_#0A0A0A]";
        statusIndicator = `<span class="bg-carbon text-radar text-[9px] px-1 font-mono ml-1">⚠ RISK</span>`;
      } else if (isVerified) {
        badgeStyle = "bg-carbon text-surface font-semibold border-carbon shadow-[2px_2px_0px_0px_#0A0A0A]";
        statusIndicator = `<span class="text-radar text-[10px] ml-1 font-bold">✓</span>`;
      }

      const iconHtml = `
        <div class="group cursor-pointer select-none">
          <div class="flex items-center px-2 py-1 text-xs border border-solid transition-transform duration-100 ${badgeStyle}">
            <span class="font-mono tracking-tight">${priceText}</span>
            ${statusIndicator}
          </div>
          <div class="w-1.5 h-1.5 bg-carbon mx-auto -mt-[1px] rotate-45 border-r border-b border-carbon"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-radar-pin",
        iconSize: [64, 28],
        iconAnchor: [32, 28],
        popupAnchor: [0, -28],
      });

      const marker = L.marker([property.coordinates.lat, property.coordinates.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 2000 : isHighRisk ? 1000 : isVerified ? 500 : 100,
      });

      marker.on("click", () => {
        onSelectProperty(property);
      });

      // Quick tooltip on hover
      marker.bindTooltip(
        `
        <div class="p-1 font-sans text-xs">
          <div class="font-mono font-bold text-[10px] text-muted-ink">${property.docketId}</div>
          <div class="font-bold text-carbon text-xs truncate max-w-[200px]">${property.title}</div>
          <div class="text-[11px] text-muted-ink">${property.neighborhood}, ${property.city}</div>
          <div class="mt-1 flex items-center justify-between text-[11px]">
            <span class="font-mono font-bold text-carbon">৳${property.monthlyRentBdt.toLocaleString()}/mo</span>
            <span class="font-mono text-[10px] ${property.riskScore >= 60 ? "text-evidence-red font-bold" : "text-evidence-green"}">
              Risk: ${property.riskScore}/100
            </span>
          </div>
        </div>
        `,
        {
          direction: "top",
          offset: [0, -26],
          className: "shadow-docket border border-carbon rounded-none bg-surface p-1.5",
        }
      );

      marker.addTo(markersGroup);
    });
  }, [properties, selectedDocketId, isMapReady, onSelectProperty]);

  // 4. Smooth pan if selected property changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedDocketId || !isMapReady) return;
    const target = properties.find((p) => p.docketId === selectedDocketId);
    if (target) {
      mapInstanceRef.current.panTo([target.coordinates.lat, target.coordinates.lng], {
        animate: true,
        duration: 0.8,
      });
    }
  }, [selectedDocketId, properties, isMapReady]);

  return (
    <div className="relative w-full h-full min-h-[420px] bg-paper border border-carbon overflow-hidden flex flex-col">
      {/* Top Floating Civic City Selector */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-1.5 bg-surface/95 p-1.5 border border-carbon shadow-docket-sm">
        <div className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-ink font-semibold">
          <Crosshair className="w-3 h-3 text-carbon" />
          <span>City Focus</span>
        </div>
        {(["ALL", "Dhaka", "Sylhet", "Chattogram"] as const).map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => onCityChange(city)}
            className={`px-2 py-1 text-xs font-mono font-bold uppercase transition-colors border ${
              activeCity === city
                ? "bg-radar text-carbon border-carbon shadow-[1px_1px_0px_0px_#0A0A0A]"
                : "bg-surface text-carbon border-carbon hover:bg-paper"
            }`}
          >
            {city === "ALL" ? "All BD" : city}
          </button>
        ))}
      </div>

      {/* Map Canvas Container */}
      <div ref={containerRef} className="w-full h-full min-h-[420px] flex-1 z-[1]" />

      {/* Bottom Floating Legend Strip */}
      <div className="absolute bottom-3 left-3 z-[400] bg-surface/95 border border-carbon px-3 py-1.5 shadow-docket-sm text-[11px] font-mono flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-radar border border-carbon inline-block"></span>
          <span className="text-carbon font-bold">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-carbon text-radar border border-carbon inline-flex items-center justify-center text-[9px] font-bold">
            ✓
          </span>
          <span className="text-carbon font-medium">Verified Owner</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-evidence-red border border-carbon text-white inline-flex items-center justify-center text-[8px] font-bold">
            ⚠
          </span>
          <span className="text-carbon font-medium">Anomaly / Duplicate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-surface border border-carbon inline-block"></span>
          <span className="text-muted-ink">Standard</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-muted-ink border-l border-grid-line pl-2">
          <Layers className="w-3 h-3" />
          <span>{properties.length} Active Dockets</span>
        </div>
      </div>
    </div>
  );
}
