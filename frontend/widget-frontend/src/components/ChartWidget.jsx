import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns"; // Для роботи з часовою віссю

const ChartWidget = () => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Opinion data
      const opinionsRes = await fetch("https://cnnarticlesapi-production.up.railway.app/opinions");
      const opinions = await opinionsRes.json();

      // Fetch Person data
      const personsRes = await fetch("https://cnnarticlesapi-production.up.railway.app/persons");
      const persons = await personsRes.json();

      // Merge data by fk_person_id
      const mergedData = opinions.map(opinion => {
        const person = persons.find(p => p.person_id === opinion.fk_person_id);
        return {
          ...opinion,
          person_name: person?.person_name || "Unknown",
          political_party: person?.political_party || "Unknown",
        };
      });
      console.log(mergedData);

      // Group data by person_name
      const groupedData = mergedData.reduce((acc, item) => {
        if (!acc[item.person_name]) {
          acc[item.person_name] = [];
        }
        acc[item.person_name].push({
          x: new Date(item.created_at), // Convert article_date to Date object
          y: item.sentiment_score,
          r: Math.min(Math.max(item.citation.length / 10, 5), 20), // Bubble size
          tooltip: `${item.person_name}: "${item.citation}"`,
        });
        return acc;
      }, {});

      // Prepare datasets for Line Chart
      const datasets = Object.keys(groupedData).map(personName => ({
        label: personName,
        data: groupedData[personName],
        borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, 0.8)`, // Random color for each person
        backgroundColor: "rgba(59, 130, 246, 0.6)", // Bubble color
        tension: 0.4, // Smooth lines
        fill: false,
        pointRadius: context => context.raw.r, // Bubble size
      }));

      // Destroy previous chart instance if exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // Create Line Chart
      const ctx = canvasRef.current.getContext("2d");
      chartRef.current = new Chart(ctx, {
        type: "line",
        data: {
          datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: context => context.raw.tooltip,
              },
            },
          },
          scales: {
            x: {
              type: "time", // Time-based axis
              time: {
                unit: "day", // Group by day
              },
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

    fetchData();
  }, []);

  return (
    <div style={{ width: "100%", height: "90vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default ChartWidget;
