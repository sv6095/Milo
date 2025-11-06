import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
// @ts-ignore
import * as turf from '@turf/turf';

interface MapProps {
  coordinates: number[][];
  onCoordinatesChange: (coordinates: number[][]) => void;
  optimizationResult?: any;
  onOptimize?: (coordinates: number[][]) => void;
}

const Map: React.FC<MapProps> = ({ coordinates, onCoordinatesChange, optimizationResult, onOptimize }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const waypoints = useRef<any>(turf.featureCollection([]));
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      // Initialize map with OpenStreetMap style for development
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm'
            }
          ]
        },
        center: [-122.339850, 47.615868], // Seattle coordinates
        zoom: 12,
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setIsMapLoaded(true);
        
        // Add waypoints source and layer
        map.current!.addSource('waypoints', {
          type: 'geojson',
          data: waypoints.current
        });

        map.current!.addLayer({
          id: 'waypoints',
          type: 'circle',
          source: 'waypoints',
          paint: {
            'circle-radius': 6,
            'circle-color': '#B53737'
          }
        });

        // Add click handler for adding markers (same as original)
        map.current!.on('click', async (event) => {
          const { lngLat } = event;
          
          // Add clicked point to waypoints
          const point = turf.point([lngLat.lng, lngLat.lat]);
          waypoints.current.features.push(point);
          
          // Update map source
          map.current!.getSource('waypoints').setData(waypoints.current);

          // Add depot marker for first point (same as original)
          if (waypoints.current.features.length === 1) {
            const depotEl = document.createElement('div');
            depotEl.className = 'depot';
            depotEl.style.cssText = `
              background-image: url('https://img.icons8.com/fluency/344/garage-closed.png');
              background-size: cover;
              width: 50px;
              height: 50px;
              cursor: pointer;
            `;
            new maplibregl.Marker(depotEl)
              .setLngLat([lngLat.lng, lngLat.lat])
              .addTo(map.current!);
          }

          // IMPORTANT: Duplicate depot coordinates (same as original logic)
          if (waypoints.current.features.length >= 1) {
            const depotPoint = turf.point(waypoints.current.features[0].geometry.coordinates);
            waypoints.current.features.push(depotPoint);
          }

          // Update coordinates for parent component (same format as original)
          const newCoordinates = waypoints.current.features.map((feature: any) => feature.geometry.coordinates);
          onCoordinatesChange(newCoordinates);

          // Auto-optimize if we have enough points (same as original behavior)
          if (waypoints.current.features.length >= 2 && onOptimize) {
            onOptimize(newCoordinates);
          }
        });
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isMapLoaded && map.current) {
      // Clear existing markers
      markers.current.forEach(marker => marker.remove());
      markers.current = [];

      // Update waypoints from coordinates prop
      waypoints.current = turf.featureCollection(
        coordinates.map(coord => turf.point(coord))
      );

      // Update map source
      map.current.getSource('waypoints').setData(waypoints.current);

      // Add depot marker for first coordinate
      if (coordinates.length > 0) {
        const depotEl = document.createElement('div');
        depotEl.className = 'depot';
        depotEl.style.cssText = `
          background-image: url('https://img.icons8.com/fluency/344/garage-closed.png');
          background-size: cover;
          width: 50px;
          height: 50px;
          cursor: pointer;
        `;
        const depotMarker = new maplibregl.Marker(depotEl)
          .setLngLat(coordinates[0])
          .addTo(map.current!);
        markers.current.push(depotMarker);
      }

      // Draw optimization routes if available
      if (optimizationResult && optimizationResult.waypoints) {
        try {
          console.log("Drawing routes with result:", optimizationResult);
          drawOptimizedRoutes(optimizationResult);
        } catch (error) {
          console.error("Error drawing routes:", error);
        }
      }
    }
  }, [coordinates, optimizationResult, isMapLoaded]);

  const drawOptimizedRoutes = (result: any) => {
    if (!map.current) return;

    console.log("drawOptimizedRoutes called with:", result);

    // Validate result structure
    if (!result || !result.waypoints) {
      console.warn("Invalid result structure:", result);
      return;
    }

    const colors = ['#ffc214', '#9900aa', '#ff7321', '#13c3f6', '#8ed813', '#e96463', '#005270', '#8D60A3', '#6FD9A7', '#48496B'];

    // Remove existing route layers
    for (let i = 0; i < 10; i++) {
      if (map.current.getLayer(`route-${i}`)) {
        map.current.removeLayer(`route-${i}`);
      }
      if (map.current.getSource(`route-${i}`)) {
        map.current.removeSource(`route-${i}`);
      }
    }

    // Handle different response structures (same as original)
    const waypointsKeys = Object.keys(result.waypoints);
    const numVehicles = waypointsKeys.length;
    
    console.log("Number of vehicles:", numVehicles);
    console.log("Waypoints keys:", waypointsKeys);
    
    if (numVehicles > 1) {
      // Multiple vehicles case (same as original lines 500-523)
      waypointsKeys.forEach((vehicleId, index) => {
        const vehicleRoutes = result.waypoints[vehicleId];
        const routeCoordinates: number[][] = [];

        console.log(`Processing vehicle ${index}:`, vehicleRoutes);

        // Check if vehicleRoutes is an array
        if (Array.isArray(vehicleRoutes)) {
          vehicleRoutes.forEach((waypoint: any) => {
            if (Array.isArray(waypoint)) {
              waypoint.forEach((w: any) => {
                if (w && w.Distance > 0 && w.Geometry?.LineString) {
                  routeCoordinates.push(...w.Geometry.LineString);
                }
              });
            }
          });
        }

        if (routeCoordinates.length > 0) {
          map.current!.addSource(`route-${index}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates.flat()
              }
            }
          });

          map.current!.addLayer({
            id: `route-${index}`,
            type: 'line',
            source: `route-${index}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': colors[index % colors.length],
              'line-width': ['interpolate', ['linear'], ['zoom'], 12, 5, 22, 12],
              'line-opacity': 0.5
            }
          });
        }
      });
    } else {
      // Single vehicle case (same as original lines 530-547)
      const a: number[][] = [];
      
      if (Array.isArray(result.waypoints)) {
        result.waypoints.forEach((waypoint: any) => {
          if (Array.isArray(waypoint)) {
            waypoint.forEach((w: any) => {
              if (w && w.Distance > 0 && w.Geometry?.LineString) {
                a.push(...w.Geometry.LineString);
              }
            });
          }
        });
      }

      if (a.length > 0) {
        map.current!.addSource('route-0', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: a
            }
          }
        });

        map.current!.addLayer({
          id: 'route-0',
          type: 'line',
          source: 'route-0',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': colors[0],
            'line-width': ['interpolate', ['linear'], ['zoom'], 12, 5, 22, 12],
            'line-opacity': 0.5
          }
        });
      }
    }
  };

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
