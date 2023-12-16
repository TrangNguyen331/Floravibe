import React from "react";
import PageTitle from "../components/Typography/PageTitle";
import ChartCard from "../components/Chart/ChartCard";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import ChartLegend from "../components/Chart/ChartLegend";
import {
  lineOptions,
  lineLegends,
  realTimeUsersBarLegends,
  realTimeUsersBarOptions,
} from "../utils/demo/chartsData";
import UsersTable from "../components/UsersTable";

const Customers = () => {
  return (
    <div>
      <PageTitle>Manage Customers</PageTitle>
      <UsersTable />
    </div>
  );
};

export default Customers;
