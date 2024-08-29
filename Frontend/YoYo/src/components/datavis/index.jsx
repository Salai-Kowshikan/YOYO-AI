import React, { useEffect } from "react";
import { Bargraph } from "@/components/ui/bargraph";
import { Piechart } from "@/components/ui/piechart";

function processData({}) {
  const jsondata = [
    {
      CustomerRequirements: {
        CarType: ["SUV"],
        FuelType: ["Diesel"],
        Color: ["White"],
        DistanceTravelled: "",
        MakeYear: [2021],
        "Transmission Type": ["automatic"],
      },
      CompanyPolicies: {
        FreeRCTransfer: false,
        "5-DayMoneyBackGuarantee": true,
        FreeRSAforOneYear: false,
        ReturnPolicy: "Registration process starts after 5 days",
      },
      CustomerObjection: [
        "RefurbishmentQuality",
        "CarIssues",
        "PriceIssues",
        "CustomerExperienceIssues",
      ],
      Extras: {
        Warranty: [
          "1 year or 15,000 kilometers for engine and gearbox",
          "3 months or 5,000 kilometers for AC and electricals",
        ],
        TestDrive: "Can be arranged in the showroom or at home",
        HomeTestDriveAvailability: "May take a couple of days to schedule",
      },
    },
    {
      CustomerRequirements: {
        CarType: ["Sedan"],
        FuelType: [],
        Color: ["Red"],
        DistanceTravelled: [120000],
        MakeYear: [2015],
        "Transmission Type": ["automatic"],
      },
      CompanyPoliciesDiscussed: [
        { FreeRCTransfer: false },
        { "5-DayMoneyBackGuarantee": true },
        { FreeRSAforOneYear: true },
        {
          ReturnPolicy: {
            "buy-back guarantee": {
              year1: 500000,
              year2: 432000,
              year3: 400000,
            },
            condition: [{ mileage: 10000, service: "authorized centers" }],
          },
        },
      ],
      CustomerObjection: ["Refurbishment Quality", "CarIssues"],
      Response: { extras: ["scratches", "paint job isn't perfect"] },
    },
    {
      CustomerRequirements: {
        CarType: ["Hatchback", "SUV"],
        FuelType: "Petrol",
        Color: ["White", "Black"],
        DistanceTravelled: null,
        MakeYear: null,
        "Transmission Type": ["automatic"],
      },
      CompanyPolicies: {
        FreeRCTransfer: true,
        "5-DayMoneyBackGuarantee": true,
        FreeRSAforOneYear: true,
        ReturnPolicy: true,
      },
      CustomerObjection: [
        "RefurbishmentQuality",
        "CarIssues",
        "PriceIssues",
        "CustomerExperienceIssues",
      ],
      extras: {
        BudgetInMind: "Yes",
        IncomeTaxReturn: "No",
        OutstandingLoans: "Yes",
        SpecificVehicleType: "Petrol vehicle",
        PreferredBrand: "Manoj has two vehicles already",
        RegisteredLocation: "WB registration",
      },
    },
  ];

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

  console.log("Car Type Counts:", carTypeCounts);
  console.log("Color Type Counts:", colorCounts);
  console.log("Transmission Type Counts:", transmissionTypeCounts);

  return (
    <div>
      <Bargraph data={carTypeCounts} />
      <Piechart data={colorCounts} />
    </div>
  );
}

export default DataVisualization;
