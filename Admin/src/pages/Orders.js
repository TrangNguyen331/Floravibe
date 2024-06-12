import React, { useState} from "react";
import PageTitle from "../components/Typography/PageTitle";
import { NavLink } from "react-router-dom";
import { DashboardIcon, RefreshIcon, SearchIcon } from "../icons";
import { Card, CardBody, Label, Select } from "@windmill/react-ui";
import OrdersTable from "../components/OrdersTable";
import RoundIcon from "../components/RoundIcon";
function Icon({ icon, ...props }) {
  const Icon = icon;
  return <Icon {...props} />;
}

const Orders = () => {
  console.log("Order Page");
  // pagination setup
  const [resultsPerPage, setResultPerPage] = useState(10);
  // filter/search
  const [filter, setFilter] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [refresh, setRefresh] = useState(false);

  const handleFilter = (filter_name) => {
    // console.log(filter_name);
    if (filter_name === "All") {
      setRefresh(!refresh);
      setSearchType("");
      setSearchValue("");
      setResultPerPage(resultsPerPage);
    }
    if (filter_name === "In-Request Orders") {
      setFilter("IN_REQUEST");
    }
    if (filter_name === "In-Processing Orders") {
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

      {/* Sort */}
      <Card className="mt-5 mb-5 shadow-md flex justify-between items-center">
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
                <option>In-Request Orders</option>
                <option>In-Processing Orders</option>
                <option>Cancel Orders</option>
                <option>Completed Orders</option>
              </Select>
            </Label>

            <Label className="">
              {/* <!-- focus-within sets the color for the icon when input is focused --> */}
              <div className="relative text-gray-500 focus-within:text-purple-600 dark:focus-within:text-purple-400">
                <input
                  className="py-3 pr-5 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"
                  value={resultsPerPage}
                  onChange={(e) => setResultPerPage(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center mr-3 pointer-events-none">
                  {/* <SearchIcon className="w-5 h-5" aria-hidden="true" /> */}
                  Results on Table
                </div>
              </div>
            </Label>
          </div>
        </CardBody>
        <Label className="mx-0 ml-auto">
          <Select
            className="py-3 rounded-r-none bg-purple-200"
            onChange={(e) => {
              setSearchType(e.target.value);
              setSearchValue("");
            }}
          >
            <option hidden>Choose to search</option>
            <option>Client</option>
            <option>Order ID</option>
            <option>Name Of Product</option>
            {/* <option>Price</option> */}
            <option>Date</option>
          </Select>
        </Label>
        <Label className="mx-0 w-70">
          <div className="relative text-gray-500 dark:focus-within:text-purple-400">
            <input
              type={searchType === "Date" ? "date" : "text"}
              className="py-3 pl-5 pr-10 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input rounded-r-full w-70"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center mr-3">
              <SearchIcon
                className="w-5 h-5 text-purple-500 transition-colors duration-200"
                aria-hidden="true"
              />
            </div>
          </div>
        </Label>
        <RoundIcon
          icon={RefreshIcon}
          onClick={() => {
            setSearchType("");
            setSearchValue("");
            setRefresh(!refresh);
            setResultPerPage(resultsPerPage);
          }}
          className="pr-3 mr-6 ml-3 hover:bg-gray-200 dark:hover:bg-gray-400 transition ease-in-out duration-200 cursor-pointer"
        />
      </Card>

      {/* Table */}
      <OrdersTable
        resultsPerPage={resultsPerPage}
        filter={filter}
        searchType={searchType}
        searchValue={searchValue}
        refresh={refresh}
      />
    </div>
  );
};

export default Orders;
