import React, { useEffect, useState } from "react";

import InfoCard from "../components/Cards/InfoCard";
import ChartCard from "../components/Chart/ChartCard";
import { Doughnut, Line } from "react-chartjs-2";
import ChartLegend from "../components/Chart/ChartLegend";
import PageTitle from "../components/Typography/PageTitle";
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon } from "../icons";
import RoundIcon from "../components/RoundIcon";

import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from "../utils/demo/chartsData";
import OrdersTable from "../components/OrdersTable";
import axiosInstance from "../axiosInstance";

function Dashboard() {
  const [dashboard, setDashBoard] = useState({
    totalCustomer: "",
    totalIncome: "",
    totalNewOrder: "",
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
  return (
    <>
      <PageTitle>Dashboard</PageTitle>

      {/* <CTA /> */}

      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total customers" value={dashboard.totalCustomer || ""}>
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard
          title="Total income"
          value={
            (dashboard.totalIncome &&
              dashboard.totalIncome.toLocaleString("vi-VN")) ||
            ""
          }
        >
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="New Orders" value={dashboard.totalNewOrder || ""}>
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
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
      <OrdersTable resultsPerPage={10} filter={""} />
    </>
  );
}

export default Dashboard;
