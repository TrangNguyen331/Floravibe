import React, { useState } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { NavLink } from "react-router-dom";
import { DashboardIcon } from "../icons";
import OrdersTable from "../components/OrdersTable";
function Icon({ icon, ...props }) {
  const Icon = icon;
  return <Icon {...props} />;
}

const Orders = () => {
  // pagination setup
  const [resultsPerPage, setResultsPerPage] = useState(7);
  return (
    <div>
      <PageTitle>Orders</PageTitle>
      {/* Breadcum */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={DashboardIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Orders</p>
      </div>

      {/* Table */}
      <OrdersTable
        resultsPerPage={resultsPerPage}
        setResultsPerPage={setResultsPerPage}
      />
    </div>
  );
};

export default Orders;
