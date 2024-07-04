import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { PieChart } from "@mui/x-charts/PieChart";
import Chart from "./Chart/ChartCard";
import { Box, LinearProgress } from "@mui/material";

function TopSelling() {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [chartData, setChartData] = useState([]);
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTopSellingProducts = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/productStats/top-products`
      );
      if (response.data) {
        let filteredData;
        if (selectedMonth === "All") {
          filteredData = response.data;
        } else {
          filteredData = response.data.filter(
            (item) => item.month === parseInt(selectedMonth, 10)
          );
        }

        // Sort data by quantitySold in descending order and take the top 10
        filteredData = filteredData
          .sort((a, b) => b.quantitySold - a.quantitySold)
          .slice(0, 10);
        setChartData(filteredData);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching top selling products:", error);
    }
  };

  useEffect(() => {
    fetchTopSellingProducts();
    generateMonthOptions();
  }, [selectedMonth]);

  const generateMonthOptions = () => {
    const currentMonth = new Date().getMonth() + 1;
    const options = [];
    for (let i = 1; i <= currentMonth; i++) {
      options.push(
        <option key={i} value={i}>
          {getMonthName(i)}
        </option>
      );
    }
    setMonths(options);
  };

  const getMonthName = (monthNumber) => {
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
    return months[monthNumber - 1];
  };

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
  };

  return (
    <Chart title="Top Selling Products">
      <div className="mb-2">
        <select value={selectedMonth} onChange={handleMonthChange}>
          <option value="All">Current Month</option>
          {months}
        </select>
      </div>
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
        <PieChart
          series={[
            {
              data: chartData.map((item) => ({
                id: item.productId,
                value: item.quantitySold,
                label: item.productName,
              })),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#8e5ea2",
                "#3cba9f",
                "#e8c3b9",
                "#c45850",
                "#4BC0C0",
                "#9966FF",
                "#FF66CC",
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#8e5ea2",
                "#3cba9f",
                "#e8c3b9",
                "#c45850",
                "#4BC0C0",
                "#9966FF",
                "#FF66CC",
              ],
            },
          ]}
          height={200}
        />
      )}
    </Chart>
  );
}

export default TopSelling;
