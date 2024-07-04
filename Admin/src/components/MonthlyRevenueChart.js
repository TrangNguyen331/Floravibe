import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axiosInstance from "../axiosInstance";
import ChartCard from "./Chart/ChartCard";
import { Box, LinearProgress } from "@mui/material";

function MonthlyRevenueChart({ year }) {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchChartData = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/statistics/monthly-revenue/${year}`
      );
      const jsonData = response.data;
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const data = new Array(12).fill(0);

      jsonData.forEach((obj) => {
        const monthIndex = obj.month - 1; // month is 1-based, convert to 0-based index
        data[monthIndex] = obj.totalRevenue;
      });

      const formattedData = data.map((value) =>
        value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      );

      setChartData({
        labels: months,
        datasets: [
          {
            label: "Revenue",
            data: data,
            // backgroundColor: "#99d9f2",
            backgroundColor: "rgb(153,217,242, 0.7)",
            borderColor: "rgb(153,217,242)",
          },
        ],
      });
      setLoading(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [year]);

  const legendData = [
    { title: "Monthly Revenue", color: "bg-blue-500" }, // Example color class, adjust as per your styling
  ];

  return (
    <div>
      <ChartCard title={`Revenue Of ${year}`}>
        {loading ? (
          <Box
            sx={{
              width: "100%",
              color: "grey.500",
              backgroundColor: "grey.500",
            }}
          >
            <LinearProgress
              sx={{
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#edebfe", // Customize bar color
                },
                backgroundColor: "#7e3af2", // Customize background color
              }}
            />
          </Box>
        ) : (
          <>
            <div className="mt-9">
              <Bar
                data={chartData}
                height={450} // Adjust height as needed
                width={600} // Adjust width as needed
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // Allow chart to resize freely
                  tooltips: {
                    callbacks: {
                      label: function (tooltipItem) {
                        return tooltipItem.yLabel.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        });
                      },
                    },
                  },
                }}
              />
            </div>
          </>
        )}
      </ChartCard>
    </div>
  );
}

export default MonthlyRevenueChart;
