import React from "react";
import { Chart } from "react-google-charts";

const SemiDonutChart = () => {
  const data = [
    ["Category", "Value"],
    ["Completed", 45],
    ["In Progress", 30],
    ["Pending", 25],
  ];

  const options = {
    pieHole: 0.6,
    pieStartAngle: 180,
    slices: {
      0: { color: "#4ade80" },  // green
      1: { color: "#fbbf24" },  // yellow
      2: { color: "#f87171" },  // red
    },
    legend: { position: "bottom" },
    tooltip: { trigger: "focus" },
  };

  return (
    <Chart
      chartType="PieChart"
      width="100%"
      height="300px"
      data={data}
      options={options}
      loader={<div>Loading Chart...</div>}
    />
  );
};

export default SemiDonutChart;
