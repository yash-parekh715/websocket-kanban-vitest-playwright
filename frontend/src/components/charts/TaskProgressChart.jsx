// src/components/charts/TaskProgressChart.jsx
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export const TaskProgressChart = ({ tasks }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!tasks) return;

    const todoCount = tasks.todo.length;
    const inProgressCount = tasks.inProgress.length;
    const doneCount = tasks.done.length;
    const totalCount = todoCount + inProgressCount + doneCount;

    const completionPercentage =
      totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

    const ctx = chartRef.current.getContext("2d");

    // Destroy previous chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new chart
    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["To Do", "In Progress", "Done"],
        datasets: [
          {
            label: "Number of Tasks",
            data: [todoCount, inProgressCount, doneCount],
            backgroundColor: [
              "rgba(99, 102, 241, 0.5)", // Indigo for To Do
              "rgba(245, 158, 11, 0.5)", // Amber for In Progress
              "rgba(16, 185, 129, 0.5)", // Green for Done
            ],
            borderColor: [
              "rgb(99, 102, 241)",
              "rgb(245, 158, 11)",
              "rgb(16, 185, 129)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0, // Show only integers
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              afterTitle: function () {
                return `Completion: ${completionPercentage}%`;
              },
            },
          },
        },
      },
    });

    // Add completion percentage as a pie chart
    const completionChart = new Chart(
      document.getElementById("completion-chart").getContext("2d"),
      {
        type: "doughnut",
        data: {
          labels: ["Done", "Remaining"],
          datasets: [
            {
              data: [completionPercentage, 100 - completionPercentage],
              backgroundColor: [
                "rgba(16, 185, 129, 0.7)", // Green for Done
                "rgba(209, 213, 219, 0.7)", // Gray for Remaining
              ],
              borderColor: ["rgb(16, 185, 129)", "rgb(209, 213, 219)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "75%",
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.label}: ${context.raw}%`;
                },
              },
            },
          },
        },
      }
    );

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      if (completionChart) {
        completionChart.destroy();
      }
    };
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <div className="h-64">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
      <div>
        <div className="h-64 flex flex-col items-center justify-center">
          <div className="relative h-40 w-40">
            <canvas id="completion-chart"></canvas>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-800">
                {tasks
                  ? Math.round(
                      (tasks.done.length /
                        (tasks.todo.length +
                          tasks.inProgress.length +
                          tasks.done.length || 1)) *
                        100
                    )
                  : 0}
                %
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm font-medium text-gray-600">
            Completion Rate
          </p>
        </div>
      </div>
    </div>
  );
};
