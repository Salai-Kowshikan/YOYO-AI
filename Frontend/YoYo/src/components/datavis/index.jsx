import React, { useEffect } from "react";
import { Bargraph } from "@/components/ui/bargraph";
import { Piechart } from "@/components/ui/piechart";

function processData({ jsondata }) {
  if (!jsondata)
    return { carTypeCounts: {}, colorCounts: {}, transmissionTypeCounts: {} };

  const carTypeCounts = {};
  const colorCounts = {};
  const transmissionTypeCounts = {};

  useEffect(() => {
    console.log("jsondata changed:", jsondata);
  }, [jsondata]);

  jsondata.forEach((entry) => {
    const { CustomerRequirements } = entry;

    // Count Car Types
    if (CustomerRequirements.CarType) {
      CustomerRequirements.CarType.forEach((type) => {
        if (carTypeCounts[type]) {
          carTypeCounts[type] += 1;
        } else {
          carTypeCounts[type] = 1;
        }
      });
    }

    // Count Colors
    if (CustomerRequirements.Color) {
      CustomerRequirements.Color.forEach((color) => {
        if (colorCounts[color]) {
          colorCounts[color] += 1;
        } else {
          colorCounts[color] = 1;
        }
      });
    }

    // Count Transmission Types
    const transmissionType = CustomerRequirements["Transmission Type"];
    if (transmissionType && transmissionType.length > 0) {
      transmissionType.forEach((type) => {
        if (transmissionTypeCounts[type]) {
          transmissionTypeCounts[type] += 1;
        } else {
          transmissionTypeCounts[type] = 1;
        }
      });
    }
  });

  return { carTypeCounts, colorCounts, transmissionTypeCounts };
}

function DataVisualization(jsondata) {
  const { carTypeCounts, colorCounts, transmissionTypeCounts } =
    processData(jsondata);

  return (
    <div>
      {/* <Bargraph data={carTypeCounts} />
      <Piechart data={jsondata} /> */}
    </div>
  );
}

export default DataVisualization;
