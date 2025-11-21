import { ViroARSceneNavigator } from "@reactvision/react-viro";
import React, { useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import ARSurroundScene, { ScanResult } from "../components/ar/ARSurroundScene";

const co2Min = 0;
const co2Max = 5;

export default function ARScanScreen() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to update result from AR scene
  const handlePlantDataUpdate = (plantData: ScanResult) => {
    console.log("Plant data received:", plantData);
    setResult(plantData);
  };

  // Function to update loading state from AR scene
  const handleLoadingUpdate = (loading: boolean) => {
    setIsLoading(loading);
  };

  // Create the scene with props - FIXED syntax
  const scene = () => (
    <ARSurroundScene 
      sceneNavigator={{
        viroAppProps: {
          onPlantDataUpdate: handlePlantDataUpdate,
          onLoadingUpdate: handleLoadingUpdate
        }
      }}
    />
  );

  // Gauge math based on CO₂ (0–5 g/day)
  const gauge = useMemo(() => {
    if (!result?.co2PerDay) {
      return { co2: 0, blocks: 10, filled: 0 };
    }
    
    const co2 = Math.max(co2Min, Math.min(co2Max, result.co2PerDay ?? 0));
    const blocks = 10;
    const filled = Math.round(((co2 - co2Min) / (co2Max - co2Min)) * blocks);
    return { co2, blocks, filled };
  }, [result?.co2PerDay]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <ViroARSceneNavigator
  initialScene={{ scene: () => <ARSurroundScene /> }}
  viroAppProps={{
    onPlantDataUpdate: handlePlantDataUpdate,
    onLoadingUpdate: handleLoadingUpdate,
  }}
  autofocus
/>

      {/* Bottom HUD panel - Only show when we have plant data */}
      {result && (
        <View style={styles.hud}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{result.plantName ?? "Plant"}</Text>
            {!!result.scientificName && (
              <Text style={styles.subtitle}>{result.scientificName}</Text>
            )}
          </View>

          <View style={styles.row}>
            <Text style={styles.kv}>Type</Text>
            <Text style={styles.v}>{result.plantType ?? "—"}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.kv}>CO₂ (g/day)</Text>
            <Text style={styles.v}>{(result.co2PerDay ?? 0).toFixed(1)}</Text>
          </View>

          {/* CO₂ scale: 0–5 g/day → green→red */}
          <View style={styles.gaugeRow}>
            {Array.from({ length: gauge.blocks }).map((_, i) => {
              const t = i / (gauge.blocks - 1);              // 0..1
              const hue = 120 - t * 120;                     // 120→0 (green→red)
              const on = i < gauge.filled;
              return (
                <View
                  key={i}
                  style={[
                    styles.gaugeBlock,
                    { 
                      backgroundColor: `hsl(${hue}, 80%, ${on ? 45 : 22}%)`, 
                      opacity: on ? 1 : 0.5 
                    },
                  ]}
                />
              );
            })}
          </View>

          <Text style={styles.meta}>
            Estimated sequestration: {(result.co2PerDay ?? 0).toFixed(1)} g/day
          </Text>
        </View>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>Analyzing plant...</Text>
        </View>
      )}

      {/* Initial instruction */}
      {!result && !isLoading && (
        <View style={styles.instructionOverlay}>
          <Text style={styles.instructionText}>
            Tap on a plant to scan it and see CO₂ data
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hud: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 14,
    backgroundColor: "rgba(12,18,32,0.85)",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  titleRow: { 
    flexDirection: "row", 
    alignItems: "baseline", 
    justifyContent: "space-between" 
  },
  title: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "700" 
  },
  subtitle: { 
    color: "rgba(255,255,255,0.7)", 
    fontSize: 12, 
    marginLeft: 8 
  },
  row: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    marginTop: 6 
  },
  kv: { 
    color: "rgba(255,255,255,0.7)", 
    fontSize: 12 
  },
  v: { 
    color: "white", 
    fontSize: 13, 
    fontWeight: "600" 
  },
  gaugeRow: { 
    flexDirection: "row", 
    gap: 4, 
    marginTop: 8 
  },
  gaugeBlock: { 
    flex: 1, 
    height: 10, 
    borderRadius: 3 
  },
  meta: { 
    color: "rgba(255,255,255,0.75)", 
    marginTop: 6, 
    fontSize: 12, 
    textAlign: "center" 
  },
  loadingOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -75 }, { translateY: -25 }],
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  instructionOverlay: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  instructionText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});