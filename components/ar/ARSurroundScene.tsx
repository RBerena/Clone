// components/ar/ARSurroundScene.tsx
import {
  ViroARScene,
  ViroFlexView,
  ViroMaterials,
  ViroNode,
  ViroSphere,
  ViroText
} from "@reactvision/react-viro";
import React, { useEffect, useState } from "react";

export type BubbleSpec = { color?: string; sizeMm?: number; transparency?: number };
export type ScanResult = {
  plantId?: string;
  plantName?: string;
  scientificName?: string;
  plantType?: string;
  co2PerDay?: number;
  healthScore?: number;
  bubble?: BubbleSpec;
  position?: [number, number, number];
  dimensions?: { width: number; height: number; depth: number };
};

type Props = {
  sceneNavigator?: {
    viroAppProps?: {
      onPlantDataUpdate?: (data: ScanResult) => void;
      onLoadingUpdate?: (loading: boolean) => void;
    };
  };
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

// CO₂ mapping functions
const co2Min = 0;
const co2Max = 5;
const co2ToSizeM = (co2 = 2) => {
  const t = clamp((co2 - co2Min) / (co2Max - co2Min), 0, 1);
  return 0.15 + t * 0.25;
};

const co2ToColor = (co2 = 2) => {
  const t = clamp((co2 - co2Min) / (co2Max - co2Min), 0, 1);
  const r = Math.round(255 * (1 - t));
  const g = Math.round(255 * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}66`;
};

// API service function
const fetchPlantData = async (imageData?: string): Promise<ScanResult> => {
  try {
    const response = await fetch('https://sandee-glottic-charlette.ngrok-free.dev/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageData, // You'll need to capture and convert camera image to base64
        // Add any other parameters your API expects
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map your API response to our ScanResult format
    return {
      plantId: data.plant_id,
      plantName: data.common_name || data.plant_name,
      scientificName: data.scientific_name,
      plantType: data.plant_type,
      co2PerDay: data.co2_absorption || data.co2_per_day,
      healthScore: data.health_score,
      dimensions: data.dimensions || { width: 0.3, height: 0.5, depth: 0.3 },
      position: data.position || [0, 0, -1],
      bubble: data.bubble_settings
    };
  } catch (error) {
    console.error('Failed to fetch plant data:', error);
    return defaultResult;
  }
};

const defaultResult: ScanResult = {
  plantName: "Unknown Plant",
  scientificName: "Unknown Species",
  plantType: "Indoor",
  co2PerDay: 2.0,
  position: [0, 0, -1],
  dimensions: { width: 0.3, height: 0.5, depth: 0.3 }
};

const ARSurroundScene = (props: Props) => {
  const [plantDetected, setPlantDetected] = useState(false);
  const [detectedPosition, setDetectedPosition] = useState<[number, number, number]>([0, 0, -1]);
  const [plantData, setPlantData] = useState<ScanResult>(defaultResult);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(true);

  // Function to capture plant and call API
  const captureAndAnalyzePlant = async (plantPosition: [number, number, number]) => {
    setLoading(true);
    
    // Notify parent about loading state
    props?.sceneNavigator?.viroAppProps?.onLoadingUpdate?.(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call your API (without image data for now)
      const data = await fetchPlantData();
      
      setPlantData(data);
      
      // Calculate bubble position to surround the plant
      const bubbleSize = getBubbleSize(data.dimensions, data.co2PerDay);
      const bubblePosition = getBubblePosition(plantPosition, data.dimensions);
      
      setDetectedPosition(bubblePosition);
      setPlantDetected(true);
      setScanning(false);
      
      // Send data back to parent screen
      props?.sceneNavigator?.viroAppProps?.onPlantDataUpdate?.(data);
      
    } catch (error) {
      console.error('Error analyzing plant:', error);
      // Fallback to default data
      const bubblePosition = getBubblePosition(plantPosition, defaultResult.dimensions!);
      setDetectedPosition(bubblePosition);
      setPlantDetected(true);
      setScanning(false);
      
      // Send fallback data to parent
      props?.sceneNavigator?.viroAppProps?.onPlantDataUpdate?.(defaultResult);
    } finally {
      setLoading(false);
      // Notify parent that loading is complete
      props?.sceneNavigator?.viroAppProps?.onLoadingUpdate?.(false);
    }
  };

  // Calculate bubble size to surround the plant
  const getBubbleSize = (dimensions: { width: number; height: number; depth: number } | undefined, co2?: number) => {
    const baseSize = co2ToSizeM(co2);
    if (!dimensions) return baseSize;
    
    const { width, height, depth } = dimensions;
    const largestDimension = Math.max(width, height, depth);
    return Math.max(baseSize, largestDimension * 1.2);
  };

  // Position the bubble to center around the plant
  const getBubblePosition = (plantPosition: [number, number, number], dimensions: { width: number; height: number; depth: number } | undefined) => {
    const [x, y, z] = plantPosition;
    if (!dimensions) return [x, y, z] as [number, number, number];
    
    // Center the bubble around the plant, adjusting for plant height
    return [x, y + (dimensions.height / 2), z] as [number, number, number];
  };

  // Handle plant detection via AR image recognition
  const handleImageFound = (event: any) => {
    console.log("Plant detected at position:", event.position);
    captureAndAnalyzePlant([event.position[0], event.position[1], event.position[2]]);
  };

  // FIXED: Proper tap event handling
  const handleSceneTap = (event: any) => {
    if (!plantDetected && !loading) {
      console.log("Full tap event:", event);
      
      // Try different event structures that Viro might use
      let tapPosition: [number, number, number] | undefined;
      
      // Method 1: Direct position array
      if (Array.isArray(event) && event.length >= 3) {
        tapPosition = [event[0], event[1], event[2]];
      }
      // Method 2: Position in event object
      else if (event.position && Array.isArray(event.position)) {
        tapPosition = [event.position[0], event.position[1], event.position[2]];
      }
      // Method 3: Coordinates in event object
      else if (event.x !== undefined && event.y !== undefined && event.z !== undefined) {
        tapPosition = [event.x, event.y, event.z];
      }
      // Method 4: Try event[0] as position (common Viro pattern)
      else if (event[0] && Array.isArray(event[0])) {
        tapPosition = [event[0][0], event[0][1], event[0][2]];
      }
      
      if (tapPosition) {
        console.log("Scene tapped at:", tapPosition);
        captureAndAnalyzePlant(tapPosition);
      } else {
        console.log("Could not determine tap position, using default");
        // Use a reasonable default position in front of camera
        captureAndAnalyzePlant([0, 0, -1]);
      }
    }
  };

  // Use data from API
  const co2 = plantData.co2PerDay ?? 2.0;
  const bubbleSize = getBubbleSize(plantData.dimensions, co2);
  const baseColor = co2ToColor(co2);
  const baseOpacity = 0.8;

  // Register materials
  useEffect(() => {
    ViroMaterials.createMaterials({
      plantBubble: { 
        lightingModel: "Constant", 
        diffuseColor: baseColor,
        writesToDepthBuffer: true,
        colorWritesMask: "All",
        blendMode: "Add",
      },
      panelBg: {
        lightingModel: "Constant",
        diffuseColor: "#0B1220",
      },
      panelStroke: {
        lightingModel: "Constant", 
        diffuseColor: "rgba(255,255,255,0.15)"
      },
      textPrimary: {
        lightingModel: "Constant",
        diffuseColor: "#FFFFFF"
      },
      textSecondary: {
        lightingModel: "Constant",
        diffuseColor: "rgba(255,255,255,0.7)"
      },
      textAccent: {
        lightingModel: "Constant",
        diffuseColor: "#16A34A"
      },
    });
  }, [baseColor]);

  return (
    <ViroARScene onClick={handleSceneTap}>
      {/* Loading state */}
      {loading && (
        <ViroText
          text="Analyzing plant..."
          position={[0, 0.3, -1.5]}
          width={2.5}
          height={0.8}
          style={{ fontSize: 10, textAlign: "center" }}
          color="#ffffff"
        />
      )}

      {/* Scanning guidance */}
      {scanning && !loading && !plantDetected && (
        <ViroText
          text="Tap anywhere to place and scan a plant"
          position={[0, 0.3, -1.5]}
          width={2.5}
          height={0.8}
          style={{ fontSize: 10, textAlign: "center" }}
          color="#ffffff"
        />
      )}

      {/* Visual tap target helper */}
      {scanning && !loading && !plantDetected && (
        <ViroSphere
          position={[0, 0, -1]}
          radius={0.02}
          materials={["textAccent"]}
          opacity={0.6}
        />
      )}

      {/* For actual plant detection using image markers */}
      {/* <ViroARImageMarker target={"plant-target"} onAnchorFound={handleImageFound} /> */}

      {/* Render bubble with API data */}
      {plantDetected && !loading && (
        <ViroNode position={detectedPosition} transformBehaviors={["billboardY"]}>
          {/* Large bubble surrounding the entire plant */}
          <ViroSphere
            position={[0, 0, 0]}
            radius={bubbleSize}
            widthSegmentCount={32}
            heightSegmentCount={32}
            materials={["plantBubble"]}
            opacity={baseOpacity}
            scale={[1, 1.1, 1]}
          />

          {/* Info panel below the bubble */}
          <ViroFlexView
            position={[0, -bubbleSize - 0.2, 0]}
            width={0.28}
            height={0.1}
            materials={["panelBg"]}
            style={{
              flexDirection: 'column',
              padding: 0.006,
            }}
            transformBehaviors={["billboardY"]}
          >
            <ViroText
              text={plantData.plantName || 'Unknown Plant'}
              width={0.26}
              height={0.016}
              materials={["textPrimary"]}
              style={{ 
                fontSize: 5,
                fontFamily: 'System', 
                textAlign: 'center' 
              }}
            />
            
            {plantData.scientificName && (
              <ViroText
                text={plantData.scientificName}
                width={0.26}
                height={0.012}
                materials={["textSecondary"]}
                style={{ 
                  fontSize: 5,
                  fontFamily: 'System', 
                  textAlign: 'center' 
                }}
              />
            )}

            <ViroText
              text={`CO₂: ${co2.toFixed(1)} g/day`}
              width={0.26}
              height={0.014}
              materials={["textAccent"]}
              style={{ 
                fontSize: 5,
                fontFamily: 'System', 
                textAlign: 'center' 
              }}
            />

            {plantData.healthScore && (
              <ViroText
                text={`Health: ${plantData.healthScore}%`}
                width={0.26}
                height={0.012}
                materials={["textPrimary"]}
                style={{ 
                  fontSize: 5,
                  fontFamily: 'System', 
                  textAlign: 'center' 
                }}
              />
            )}
          </ViroFlexView>
        </ViroNode>
      )}
    </ViroARScene>
  );
};

export default ARSurroundScene;

