import React, { useEffect, useState } from "react";

import InfoCard from "../components/Cards/InfoCard";
import ChartCard from "../components/Chart/ChartCard";
import { Doughnut, Line } from "react-chartjs-2";
import ChartLegend from "../components/Chart/ChartLegend";
import PageTitle from "../components/Typography/PageTitle";
import {
  ChatIcon,
  CartIcon,
  MoneyIcon,
  PeopleIcon,
  TruckIcon,
  CheckIcon,
  CancelIcon,
  RefreshIcon,
} from "../icons";
import RoundIcon from "../components/RoundIcon";
import { Card, CardBody, Label, Select } from "@windmill/react-ui";

import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from "../utils/demo/chartsData";
import OrdersTable from "../components/OrdersTable";
import axiosInstance from "../axiosInstance";
import StatisticProduct from "../components/StatisticProduct";
import TestStatstic from "../components/TestStatstic";

function Dashboard() {
  const [dashboard, setDashBoard] = useState({
    totalCustomer: "",
    totalIncome: "",
    totalNewOrder: "",
    totalShippingOrder: "",
    totalCancelOrder: "",
    totalCompleteOrder: "",
  });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const dashboardInfo = await axiosInstance.get(
          "/api/v1/about-us/dashboard"
        );
        setDashBoard(dashboardInfo.data);
        console.log("dashboardInfo", dashboardInfo.data);
      } catch (error) {
        console.log("Load data Error", error);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  const [filter, setFilter] = useState("");
  const [refresh, setRefresh] = useState(false);

  const handleFilter = (filter_name) => {
    // console.log(filter_name);
    if (filter_name === "All") {
      setRefresh(!refresh);
    }
    if (filter_name === "In Request Orders") {
      setFilter("IN_REQUEST");
    }
    if (filter_name === "In Progress Orders") {
      setFilter("IN_PROCESSING");
    }
    if (filter_name === "Cancel Orders") {
      setFilter("CANCEL");
    }
    if (filter_name === "Completed Orders") {
      setFilter("COMPLETED");
    }
  };

  return (
    <>
      <PageTitle>Dashboard</PageTitle>

      {/* <CTA /> */}

      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          title="New Orders"
          onClick={() => setFilter("IN_REQUEST")}
          value={dashboard.totalNewOrder || "0"}
        >
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4 cursor-pointer"
          />
        </InfoCard>

        <InfoCard
          title="Shipping Orders"
          onClick={() => setFilter("IN_PROCESSING")}
          value={dashboard.totalShippingOrder || "0"}
        >
          <RoundIcon
            icon={TruckIcon}
            iconColorClass="text-pink-500 dark:text-pink-100"
            bgColorClass="bg-pink-100 dark:bg-pink-500"
            className="mr-4 cursor-pointer"
          />
        </InfoCard>

        <InfoCard
          title="Complete Orders"
          value={dashboard.totalCompleteOrder || "0"}
          onClick={() => setFilter("COMPLETED")}
        >
          <RoundIcon
            icon={CheckIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4 cursor-pointer"
          />
        </InfoCard>

        <InfoCard
          title="Cancel Orders"
          onClick={() => setFilter("CANCEL")}
          value={dashboard.totalCancelOrder || "0"}
        >
          <RoundIcon
            icon={CancelIcon}
            iconColorClass="text-gray-500 dark:text-gray-100"
            bgColorClass="bg-gray-100 dark:bg-gray-500"
            className="mr-4 cursor-pointer"
          />
        </InfoCard>

        <InfoCard
          disableHover
          title="Total Customers"
          value={dashboard.totalCustomer || "0"}
        >
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="totalCustomer mr-4"
          />
        </InfoCard>

        <InfoCard
          disableHover
          title="Total Income"
          value={
            (dashboard.totalIncome &&
              dashboard.totalIncome.toLocaleString("vi-VN")) + " ₫" || ""
          }
        >
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-purple-500 dark:text-purple-100"
            bgColorClass="bg-purple-100 dark:bg-purple-500"
            className="totalIncome mr-4"
          />
        </InfoCard>
      </div>

      {/* <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="User Analytics">
          <Line {...lineOptions} />
          <ChartLegend legends={lineLegends} />
        </ChartCard>

        <ChartCard title="Revenue">
          <Doughnut {...doughnutOptions} />
          <ChartLegend legends={doughnutLegends} />
        </ChartCard>
      </div> */}
      <PageTitle>Orders</PageTitle>
      <Card className="mt-2 mb-5 shadow-md flex justify-between items-center">
        <CardBody>
          <div className="flex items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Filter Orders
            </p>

            <Label className="mx-3">
              <Select
                className="py-3"
                onChange={(e) => handleFilter(e.target.value)}
              >
                <option>All</option>
                <option>In Request Orders</option>
                <option>In Progress Orders</option>
                <option>Cancel Orders</option>
                <option>Completed Orders</option>
              </Select>
            </Label>
          </div>
        </CardBody>
        <RoundIcon
          icon={RefreshIcon}
          onClick={() => {
            setRefresh(!refresh);
          }}
          className="pr-3 mr-6 hover:bg-gray-200 dark:hover:bg-gray-400 transition ease-in-out duration-200 cursor-pointer"
        />
      </Card>
      <OrdersTable resultsPerPage={5} filter={filter} refresh={refresh} />

      <PageTitle>Statistic Product</PageTitle>
      <StatisticProduct />
      <TestStatstic />
    </>
  );
}

export default Dashboard;
