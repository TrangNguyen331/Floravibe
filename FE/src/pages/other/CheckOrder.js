import React, { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../axiosInstance";
import { formatReadableDate } from "../../helpers/helper";
import { Link } from "react-router-dom";

const CheckOrder = ({ location }) => {
  const { pathname } = location;
  const { t } = useTranslation(["orders", "breadcrumb"]);
  const token = useSelector((state) => state.auth.token);
  const [allOrders, setAllOrders] = useState([]);
  const [loadingGet, setLoadingGet] = useState(false);
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterApplied, setFilterApplied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("");
  //   const getAllOrders = async () => {
  //     try {
  //       const response = await axiosInstance.get("/api/v1/orders/allOrders", {
  //         timeout: 7000,
  //       });
  //       setAllOrders(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   useEffect(() => {
  //     getAllOrders();
  //   }, []);
  const clickCheckOrders = async () => {
    if (!email && !orderId) {
      return;
    }
    setLoadingGet(true);
    const response = await axiosInstance.get("/api/v1/orders/allOrders", {
      timeout: 10000,
    });

    let filtered = response.data;
    if (email) {
      filtered = filtered.filter(
        (order) => order.additionalOrder.email === email
      );
    }
    if (orderId) {
      filtered = filtered.filter((order) => order.id === orderId);
    }
    setFilteredOrders(filtered);
    setFilterApplied(true);
    console.log(filtered);

    setLoadingGet(false);
  };
  const clickViewDetails = (orderId) => {
    setSelectedOrder(orderId);
  };
  return (
    <Fragment>
      <MetaTags>
        <title>Check Order</title>
        <meta name="Checkout" content="Checkout" />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {t("breadcrumb:home")}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Check Order
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="check-order-area pt-50 pb-50">
          <div className="container">
            <h3 className="check-order-title">Check Order Status</h3>
            <div className="row items-end">
              <div className="col-lg-5 col-md-4">
                <div className="check-input mb-20">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-lg-5 col-md-4">
                <div className="check-input mb-20">
                  <label>Order ID</label>
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-lg-2 col-md-4">
                <div className="check-input mb-20">
                  <button className="check-btn" onClick={clickCheckOrders}>
                    Check
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="order-area pb-90">
          <div className="container">
            {loadingGet ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div className="row" key={order.id}>
                  <div className="col-lg-12">
                    <div className="order-wrap">
                      <div className="order-product-info">
                        <div className="order-top">
                          <ul>
                            <li>
                              <div className="order-id-date">
                                <p>
                                  {t("detail.id")} {order.id}
                                </p>
                                <p className="order-datetime">
                                  {t("detail.date")}{" "}
                                  {formatReadableDate(order.createdDate)}
                                </p>
                              </div>
                            </li>
                            <li className="order-status">
                              {order.status === "IN_REQUEST" &&
                                t("list.request")}
                              {order.status === "IN_PROCESSING" &&
                                t("list.process")}
                              {order.status === "COMPLETED" &&
                                t("list.complete")}
                              {order.status === "CANCEL" && t("list.canceled")}
                            </li>
                          </ul>
                        </div>
                        <div className="order-middle">
                          <ul>
                            {order.details.map((detail) => (
                              <li key={detail.productId}>
                                <span className="order-middle-left">
                                  {detail.product.name} x {detail.quantity}
                                </span>
                                <span className="order-price">
                                  {detail.subtotal.toLocaleString("vi-VN")}₫
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="order-total-wrap">
                          <ul>
                            <li>
                              <span>{t("detail.pay-method")}</span>
                              <span>{order.methodPaid}</span>
                            </li>
                            <li>
                              <span className="order-total">
                                {t("detail.total")}
                              </span>
                              <span className="order-total-price">
                                {order.total.toLocaleString("vi-VN")}₫
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="order-details-link-wrapper">
                          <span>
                            {order.cancelDetail.cancelRole === "USER"
                              ? "Được hủy bởi bạn"
                              : "Được hủy bởi shop"}
                          </span>
                          <div className="order-details-link">
                            <Link
                              to={
                                process.env.PUBLIC_URL +
                                "/checkorder/" +
                                order.id
                              }
                            >
                              {t("list.view-details")}{" "}
                              <i className="fa fa-long-arrow-right"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : filterApplied ? (
              <p>No Order Found</p>
            ) : (
              ""
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default CheckOrder;
