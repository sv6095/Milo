import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Settings, ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "@/config/aws-config";
import Map from "@/components/Map";

interface RouteOptimizationRequest {
  coordinates: number[][];
  travel_mode: string;
  num_vehicles: number;
  max_route_length: number;
  balance_route_length: number;
  departure_time: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [travelMode, setTravelMode] = useState("Car");
  const [numVehicles, setNumVehicles] = useState(1);
  const [maxRouteLength, setMaxRouteLength] = useState(50);
  const [balanceRoutes, setBalanceRoutes] = useState(100);
  const [departureTime, setDepartureTime] = useState("");
  const [coordinates, setCoordinates] = useState<number[][]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);

  const handleAddLocation = () => {
    // Add sample coordinates for Seattle area
    const sampleCoords = [
      [-122.339850, 47.615868], // Depot
      [-122.335167, 47.608013], // Stop 1
      [-122.347658, 47.620182], // Stop 2
      [-122.332071, 47.606209], // Stop 3
      [-122.352214, 47.608013], // Stop 4
    ];
    setCoordinates(sampleCoords);
  };

  const handleClearLocations = () => {
    setCoordinates([]);
    setOptimizationResult(null);
  };

  const testApiConnection = async () => {
    try {
      console.log("Testing API connection...");
      // Try proxy first, then direct URL
      const proxyUrl = "/api/";
      const directUrl = "https://fs7n3lrcf8.execute-api.us-east-1.amazonaws.com/Prod/";
      
      const testResponse = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: [[-122.339850, 47.615868], [-122.335167, 47.608013]],
          travel_mode: "Car",
          num_vehicles: 1,
          max_route_length: 50,
          balance_route_length: 100,
          departure_time: new Date().toISOString(),
        }),
      });
      
      console.log("Test response status:", testResponse.status);
      return testResponse.ok;
    } catch (error) {
      console.error("API test failed:", error);
      return false;
    }
  };

  const handleOptimize = async (coords?: number[][]) => {
    const coordinatesToUse = coords || coordinates;
    
    if (coordinatesToUse.length < 2) {
      alert("Please add at least 2 locations (depot + 1 delivery point)");
      return;
    }

    setIsOptimizing(true);
    
    // Use the same request format as the original HTML file
    const requestBody = {
      coordinates: coordinatesToUse,
      travel_mode: travelMode,
      num_vehicles: parseInt(numVehicles.toString()),
      max_route_length: parseInt(maxRouteLength.toString()),
      balance_route_length: parseInt(balanceRoutes.toString()),
      departure_time: departureTime || new Date().toISOString(),
    };

    console.log("Request body:", requestBody);
    console.log("Coordinates:", coordinatesToUse);

    try {
      // Use proxy URL for development to avoid CORS issues
      const apiUrl = import.meta.env.DEV ? "/api/" : "https://fs7n3lrcf8.execute-api.us-east-1.amazonaws.com/Prod/";
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        mode: 'cors', // Explicitly set CORS mode
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Optimization response:", data);
      setOptimizationResult(data);
    } catch (error) {
      console.error("Error optimizing route:", error);
      
      // More specific error handling
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert("Network error: Unable to connect to the optimization service. Please check your internet connection and try again.");
      } else if (error.message.includes('CORS')) {
        alert("CORS error: The API server is not allowing requests from this domain. Please contact the administrator.");
      } else {
        alert(`Failed to optimize route: ${error.message}`);
      }
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-soft sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Milo Dashboard</span>
              </div>
            </div>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Route Configuration</CardTitle>
                <CardDescription>Configure your delivery route optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Departure Time */}
                <div>
                  <label className="block text-sm font-medium mb-2">Departure Time</label>
                  <input
                    type="datetime-local"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>

                {/* Travel Mode */}
                <div>
                  <label className="block text-sm font-medium mb-2">Travel Mode</label>
                  <div className="space-y-2">
                    {["Car", "Truck", "Walking"].map((mode) => (
                      <label key={mode} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="travel_mode"
                          value={mode}
                          checked={travelMode === mode}
                          onChange={(e) => setTravelMode(e.target.value)}
                          className="text-primary"
                        />
                        <span className="text-sm">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Fleet Configuration */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fleet Size: <span className="text-primary font-bold">{numVehicles}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={numVehicles}
                    onChange={(e) => setNumVehicles(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Max Route Length */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Max Route Length: <span className="text-primary font-bold">{maxRouteLength} miles</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={maxRouteLength}
                    onChange={(e) => setMaxRouteLength(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Balance Routes */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Balance Routes: <span className="text-primary font-bold">{balanceRoutes}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="25"
                    value={balanceRoutes}
                    onChange={(e) => setBalanceRoutes(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>None</span>
                    <span>Light</span>
                    <span>Moderate</span>
                    <span>Heavy</span>
                    <span>Full</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                  <Button 
                    onClick={handleAddLocation} 
                    variant="outline" 
                    className="w-full"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Add Sample Locations ({coordinates.length})
                  </Button>
                  {coordinates.length > 0 && (
                    <Button 
                      onClick={handleClearLocations} 
                      variant="outline" 
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All Locations
                    </Button>
                  )}
                  <Button 
                    onClick={() => testApiConnection()} 
                    variant="outline" 
                    className="w-full"
                  >
                    Test API Connection
                  </Button>
                  <Button 
                    onClick={handleOptimize} 
                    variant="hero" 
                    className="w-full"
                    disabled={isOptimizing || coordinates.length < 2}
                  >
                    {isOptimizing ? "Optimizing..." : "Optimize Routes"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {optimizationResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Optimization Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Distance</div>
                      <div className="text-2xl font-bold text-primary">
                        {optimizationResult.summary?.[0]?.Distance?.toFixed(2) || "N/A"} miles
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Vehicles Used</div>
                      <div className="text-2xl font-bold">{numVehicles}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Map Area */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader>
                <CardTitle>Route Visualization</CardTitle>
                <CardDescription>
                  Click on the map to add delivery locations. The first point will be your depot.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-5rem)]">
                <Map 
                  coordinates={coordinates}
                  onCoordinatesChange={setCoordinates}
                  optimizationResult={optimizationResult}
                  onOptimize={handleOptimize}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

