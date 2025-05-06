import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { getChartData } from "../data/getChartData";
import LegendPanel from "./LegendPanel";

const ChartWidget = () => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [legendData, setLegendData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { groupedData, legendData } = await getChartData();
      setLegendData(legendData);
      

      const datasets = legendData.map(person => ({
        label: person.name,
        data: groupedData[person.name],
        borderColor: person.color,
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        tension: 0.4,
        fill: false,
        pointRadius: ctx => ctx.raw.r,
      }));

      if (chartRef.current) chartRef.current.destroy();
      const ctx = canvasRef.current.getContext("2d");
      chartRef.current = new Chart(ctx, {
        type: "line",
        data: { datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: ctx => ctx.raw.tooltip,
              },
            },
            legend: { display: false },
          },
          scales: {
            x: {
              type: "time",
              time: { unit: "day" },
              title: { display: true, text: "Date" },
            },
            y: {
              title: { display: true, text: "Sentiment Score" },
              beginAtZero: true,
            },
          },
        },
      });
    };
    load();
  }, []);
  console.log(legendData);
  

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Легенда */}
      <div style={{ flexShrink: 0 }}>
        <LegendPanel data={legendData} />
      </div>
      {/* Графік */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>
    </div>
  );
};

export default ChartWidget;