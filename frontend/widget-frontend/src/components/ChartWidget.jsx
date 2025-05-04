import { useEffect, useState } from "react";
import { Chart } from "chart.js/auto";

const ChartWidget = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://cnnarticlesapi-production.up.railway.app/articles/")
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  useEffect(() => {
    if (!data.length) return;
    const canvas = document.getElementById("myChart");
    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map(item => item.title),
        datasets: [{
          label: "Views",
          data: data.map(item => item.views),
          backgroundColor: "rgba(59, 130, 246, 0.6)"
        }]
      }
    });
  }, [data]);

  return <canvas id="myChart" width="600" height="400"></canvas>;
};

export default ChartWidget;