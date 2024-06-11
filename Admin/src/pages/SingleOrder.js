import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { DashboardIcon } from "../icons";
import {
  Card,
  CardBody,
  Badge,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Button,
  Avatar,
} from "@windmill/react-ui";
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
      <PageTitle>Order Details</PageTitle>
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
            <NavLink exact to="/app/orders" className="mx-2 text-purple-600">
              All Orders
            </NavLink>
            {">"}
            <p className="mx-2">{order.id}</p>
          </div>

          <Card className="my-8 shadow-md">
            <CardBody>
              <div className="p-4">
                <div className="flex items-center justify-between py-5">
                  <h3>Order {order.id}</h3>
                  <Badge className="py-1 px-2" type="success">
                    {order.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="py-1 px-2 gap-2 text-sm" type="neutral">
                    Order time:
                    <span className="font-normal">
                      {new Date(order.createdDate).toLocaleString("vi-VN")}
                    </span>
                  </Badge>
                  {order.status === "CANCEL" && (
                    <Badge className="py-1 px-2 gap-2 text-sm" type="neutral">
                      Cancel time:
                      <span className="font-normal">
                        {new Date(order.cancelDate).toLocaleString("vi-VN")}
                      </span>
                    </Badge>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
            <Card className="shadow-md md:col-span-1">
              <CardBody>
                {/* Divider */}
                {/* <hr className="mx-3 my-2 customeDivider" /> */}
                <div className="p-4">
                  <h2 className="mb-4">Customer & Order</h2>
                  <ul>
                    <li className="mb-2 flex justify-between">
                      <span>Name:</span>
                      <span>{order.additionalOrder.fullName}</span>
                    </li>
                    <li className="mb-2 flex justify-between">
                      <span>Email:</span>
                      <span>{order.additionalOrder.email}</span>
                    </li>
                    <li className="mb-2 flex justify-between">
                      <span>Phone:</span>
                      <span>{order.additionalOrder.phone}</span>
                    </li>
                    <li className="mb-2 flex justify-between">
                      <span>Delivery date:</span>
                      <span>{order.deliveryDate}</span>
                    </li>
                    <li className="mb-2 flex justify-between">
                      <span>Delivery time:</span>
                      <span>{order.deliveryTime}</span>
                    </li>
                    <li className="mb-2 flex justify-between">
                      <span>Payment method:</span>
                      <span>{order.methodPaid}</span>
                    </li>
                  </ul>
                </div>
              </CardBody>
            </Card>
            <Card className="shadow-md md:col-span-1">
              <CardBody>
                {/* Divider */}
                {/* <hr className="mx-3 my-2 customeDivider" /> */}
                <div className="p-4">
                  <h2 className="mb-4">Shipping Address</h2>
                  <div>
                    {order.additionalOrder.houseNumber},{" "}
                    {order.additionalOrder.ward},{" "}
                    {order.additionalOrder.district},{" "}
                    {order.additionalOrder.city}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          <div>
            <Card>
              <CardBody>
                <div className="p-4">
                  <h2 className="mb-4">Products ordered</h2>
                  <TableContainer>
                    <Table>
                      <TableHeader>
                        <tr>
                          <TableCell>PRODUCT NAME</TableCell>
                          <TableCell>UNIT PRICE</TableCell>
                          <TableCell>QUANTITY</TableCell>
                          <TableCell>SUBTOTAL</TableCell>
                        </tr>
                      </TableHeader>
                      <TableBody>
                        {order.details.map((detail, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <TableCell>{detail.product.name}</TableCell>
                            <TableCell>{detail.product.price}</TableCell>
                            <TableCell>{detail.quantity}</TableCell>
                            <TableCell>{detail.subtotal}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SingleOrder;
