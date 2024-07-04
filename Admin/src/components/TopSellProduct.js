import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { Doughnut, Pie } from "react-chartjs-2";
import Chart from "./Chart/ChartCard";
import {
  Box,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
} from "@mui/material";

function TopSellProduct() {
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
      setLoading(false);
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
        <MenuItem key={i} value={i}>
          {getMonthName(i)}
        </MenuItem>
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
      <div className="mb-4">
        <FormControl variant="standard">
          <InputLabel id="month-select-label">Month</InputLabel>
          <Select
            labelId="month-select-label"
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            <MenuItem value="All">All Months</MenuItem>
            {months}
          </Select>
        </FormControl>
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
      ) : chartData.length === 0 ? (
        <Box
          sx={{
            width: "100%",
            color: "grey.500",
            textAlign: "center",
            padding: "20px",
            backgroundColor: "rgba(193, 167, 241, 0.2)",
            borderRadius: "4px",
          }}
        >
          No data available for the selected month
        </Box>
      ) : (
        <Pie
          data={{
            labels: chartData.map((item) => item.productName),
            datasets: [
              {
                data: chartData.map((item) => item.quantitySold),
                backgroundColor: [
                  "rgba(171, 222, 230, 0.7)",
                  "rgba(203, 170, 203, 0.7)",
                  "rgba(255, 255, 181, 0.7)",
                  "rgba(255, 204, 182, 0.7)",
                  "rgba(182, 207, 182, 0.7)",
                  "rgba(243, 176, 195, 0.7)",
                  "rgba(109, 146, 208, 0.7)",
                  "rgba(75, 192, 192, 0.7)",
                  "rgba(236, 213, 227, 0.7)",
                  "rgba(193, 167, 241, 0.7)",
                ],
                borderColor: [
                  "rgb(171, 222, 230)",
                  "rgb(203, 170, 203)",
                  "rgb(255, 255, 181)",
                  "rgb(255, 204, 182)",
                  "rgb(182, 207, 182)",
                  "rgb(243, 176, 195)",
                  "rgb(109, 146, 208)",
                  "rgb(75, 192, 192)",
                  "rgb(236, 213, 227)",
                  "rgb(193, 167, 241)",
                ],
                hoverBackgroundColor: [
                  "#079DD9",
                  "#8e5ea2",
                  "#FFCE56",
                  "#FEAFA2",
                  "#3cba9f",
                  "#FF6384",
                  "#0280BD",
                  "#4BC0C0",
                  "#e8c3b9",
                  "#9966FF",
                ],
              },
            ],
          }}
          height={200}
        />
      )}
    </Chart>
  );
}

export default TopSellProduct;
