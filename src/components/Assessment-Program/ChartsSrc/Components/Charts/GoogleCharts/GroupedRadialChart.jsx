import React from "react";
import { Chart } from "react-google-charts";

const GroupedRadialChart = () => {
  const data = [
    [
      "Competency",
      "Leadership",
      "Technical",
      "Behavioral",
      "Communication",
      { role: "style" }
    ],
    ["Employee A", 80, 90, 70, 85, "#4ade80"],
    ["Employee B", 70, 85, 75, 80, "#fbbf24"],
    ["Employee C", 75, 80, 80, 70, "#f87171"]
  ];

  const options = {
    chartArea: { width: "80%", height: "80%" },
    hAxis: {
      minValue: 0,
      maxValue: 100,
      gridlines: { count: 5 }
    },
    vAxis: {
      minValue: 0,
      maxValue: 100,
      gridlines: { count: 5 }
    },
    legend: { position: "bottom" },
    seriesType: "radar",
    radar: { axis: true }
  };

  return (
    <Chart
      chartType="RadarChart"
      width="100%"
      height="320px"
      data={data}
      options={options}
      loader={<div>Loading Chart...</div>}
    />
  );
};

export default GroupedRadialChart;
