import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { DashboardIcon } from "../icons";
import { Card, CardBody, Badge, Button, Avatar } from "@windmill/react-ui";
import { genRating } from "../utils/genarateRating";
import axiosInstance from "../axiosInstance";
const SingleOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const formatReadableDate = (date) => {
    const parsedDate = new Date(date);
    // Format the date using Intl.DateTimeFormat
    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(parsedDate);
    return formattedDateTime;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/orders/" + id);
        setOrder(response.data);
      } catch (error) {}
    };
    fetchData();
  }, []);
  console.log("order", order);
  return (
    <div>
      <PageTitle>Product Details</PageTitle>
      {order ? (
        <div>
          {/* Breadcum */}
          <div className="flex text-gray-800 dark:text-gray-300">
            <div className="flex items-center text-purple-600">
              <Icon
                className="w-5 h-5"
                aria-hidden="true"
                icon={DashboardIcon}
              />
              <NavLink exact to="/app/dashboard" className="mx-2">
                Dashboard
              </NavLink>
            </div>
            {">"}
            <NavLink
              exact
              to="/app/all-products"
              className="mx-2 text-purple-600"
            >
              All Orders
            </NavLink>
            {">"}
            <p className="mx-2">{order.id}</p>
          </div>

          <Card className="my-8 shadow-md">
            <CardBody></CardBody>
          </Card>
          {/* Product Reviews and Description */}
          <Card className="my-8 shadow-md">
            <CardBody>
              {/* Divider */}
              <hr className="mx-3 my-2 customeDivider" />

              {/* Component area */}
            </CardBody>
          </Card>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SingleOrder;
