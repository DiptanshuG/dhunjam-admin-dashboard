import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Label,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0]?.value || 0;
    return (
      <div className="custom-tooltip">
        <p style={{ fontWeight: "bold" }}>{`${label}: ₹${value.toFixed(2)}`}</p>
      </div>
    );
  }

  return null;
};
const ColumnChart = ({ chartData }) => {
  return (
    <div id="line-column-chart">
      <div className="chart-container">
        <BarChart
          width={600}
          height={300}
          data={chartData.labels.map((label, index) => ({
            label,
            lineData: chartData.lineData[index],
            columnData: chartData.columnData[index],
          }))}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid stroke="transparent" strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis
            tick={false}
            label={
              <Label
                value="₹"
                position="insideTop"
                style={{ textAnchor: "middle", fontSize: 40 }}
              />
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="columnData" fill="#FFB6C1	" barSize={20} />
        </BarChart>
      </div>
    </div>
  );
};

export default ColumnChart;
