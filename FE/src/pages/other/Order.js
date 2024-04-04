import React, { Fragment, useEffect, useState } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import axiosInstance from "../../axiosInstance";
import { useParams } from "react-router-dom";
import { formatReadableDate, getStatus } from "../../helpers/helper";

const Order = ({ location }) => {
  console.log("Order details page");
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/orders/" + id);
        console.log("response", response);
        setOrder((prevOrders) => response.data);
      } catch (error) {
        console.log("Fail to load Order");
      }
    };

    fetchData();
  }, []);
  console.log(order);
  const { pathname } = location;
  return !order ? (
    ""
  ) : (
    <Fragment>
      <MetaTags>
        <title>Orders</title>
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/my-order"}>
        Back to list
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Order Details
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="order-main-area pt-90 pb-100">
          <div className="container">
            <Fragment>
              <div className="row">
                <div className="col-lg-7 col-md-4">
                  <div className="order-wrap">
                    <div className="order-product-info">
                      <div className="order-top">
                        <ul>
                          <li>
                            <div className="order-id-date">
                              <p>Order ID: {order.id} </p>
                              <p className="order-datetime">
                                Order Date:{" "}
                                {formatReadableDate(order.createdDate)}
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="order-status-qty">
                              <p className="order-status">
                                {getStatus(order.status)}
                              </p>
                              <p>{order.details.length} Products</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="order-bottom">
                        <ul>
                          <li>
                            <span className="order-bottom-left">Shipping</span>
                            <span>Free</span>
                          </li>
                          <li>
                            <span className="order-bottom-left">
                              Payment Method
                            </span>
                            <span>{order.methodPaid}</span>
                          </li>
                        </ul>
                      </div>
                      <div className="order-total-wrap">
                        <ul>
                          <li className="order-total">Total</li>
                          <li>{order.total.toLocaleString("vi-VN")}đ</li>
                        </ul>
                      </div>
                    </div>

                    <div className="payment-method"></div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-4">
                  <div className="order-wrap">
                    <div className="order-product-info">
                      <div className="order-top">
                        <h4>Shipping Address</h4>
                      </div>
                      <div className="order-details-middle">
                        <ul>
                          <li>
                            <span>Full Name:</span>{" "}
                            {order.additionalOrder.fullName}
                          </li>
                          <li>
                            <span>Address</span>
                          </li>
                          <li>
                            <p>{order.additionalOrder.address}</p>
                          </li>
                          <li>
                            <span>Phone:</span> {order.additionalOrder.phone}
                          </li>
                          <li>
                            <span>Email:</span> {order.additionalOrder.email}
                          </li>
                        </ul>
                      </div>
                      <div className="order-bottom">
                        <ul>
                          <h4>Order notes</h4>
                          <li>
                            <p>{order.additionalOrder.additionalInformation}</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-lg-12">
                  <div className="table-content table-responsive cart-table-content">
                    <table>
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Product Name</th>
                          <th>Unit Price</th>
                          <th>Qty</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.details.map((detail) => (
                          <tr key={detail.productId}>
                            <td className="product-thumbnail">
                              <img
                                className="img-fluid"
                                src={detail.product.images[0]}
                                alt=""
                              />
                            </td>
                            <td className="product-name text-center">
                              {detail.product.name}
                            </td>
                            <td className="product-price-cart">
                              <span className="amount">
                                {detail.product.price.toLocaleString("vi-VN")}đ
                              </span>
                            </td>
                            <td className="product-quantity text-center">
                              x{detail.quantity}
                            </td>
                            <td className="product-subtotal">
                              {detail.subtotal.toLocaleString("vi-VN")}đ
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Fragment>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Order;
