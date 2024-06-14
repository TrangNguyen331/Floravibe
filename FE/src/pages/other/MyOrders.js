import React, { Fragment, useEffect, useState } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import { useSelector } from "react-redux";
import axiosInstance from "../../axiosInstance";
import {
  filterOrderByStatus,
  formatReadableDate,
  getStatus,
} from "../../helpers/helper";
import { useTranslation } from "react-i18next";
import Evaluate from "./Evaluate";
import EditReview from "./EditReview";
import CancelVnpay from "./CancelVnpay";

const MyOrders = ({ location }) => {
  const token = useSelector((state) => state.auth.token);
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [loadingGet, setLoadingGet] = useState(false);
  const [currentFilterOrder, setCurrentOrderFilter] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isCancelShow, setCancelShow] = useState(false);
  const { t } = useTranslation(["orders", "breadcrumb"]);
  const { pathname } = location;
  const filterOrder = (key) => {
    setCurrentOrderFilter(filterOrderByStatus(orders, key));
  };
  const getSortedOrder = (orders) => {
    if (!orders) {
      orders = [];
    }
    return [...orders].sort(
      (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
    );
  };
  const fetchData = async () => {
    setLoadingGet(true);
    try {
      const response = await axiosInstance.get("/api/v1/orders");
      setOrders(response.data);
      setCurrentOrderFilter((prevFilter) =>
        filterOrderByStatus(response.data, "All")
      );
      setLoadingGet(false);
    } catch (error) {
      console.log("Fail to load my orders");
    }
  };
  const clickRating = async (orderId) => {
    setOrderId(orderId);
    setModalShow(true);
  };
  const clickRated = async (orderId) => {
    setOrderId(orderId);
    setIsEdit(true);
  };
  const clickCancel = async (orderId, methodPaid) => {
    try {
      await axiosInstance.put(`api/v1/orders/${orderId}/cancel`);
      await fetchData();
      if (methodPaid === "VNPAY") {
        setCancelShow(true);
      }
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Fragment>
      <MetaTags>
        <title>Floravibe | {t("breadcrumb:orders")}</title>
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {t("breadcrumb:home")}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {t("breadcrumb:orders")}
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="order-main-area pt-90 pb-100">
          <div className="container">
            <Fragment>
              <h3 className="order-page-title">{t("list.history")}</h3>
              <div className="row">
                <div className="col-12">
                  <Tab.Container defaultActiveKey="all">
                    <Nav
                      variant="pills"
                      className="order-tab-list-5 pt-30 pb-55 text-center"
                    >
                      <Nav.Item>
                        <Nav.Link
                          eventKey="all"
                          onSelect={() => filterOrder("All")}
                        >
                          <h4>{t("list.all")}</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="inRequest"
                          onSelect={() => filterOrder("InProgress")}
                        >
                          <h4>{t("list.request")}</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="processing"
                          onSelect={() => filterOrder("Processing")}
                        >
                          <h4>{t("list.process")}</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="completed"
                          onSelect={() => filterOrder("Completed")}
                        >
                          <h4>{t("list.complete")}</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="canceled"
                          onSelect={() => filterOrder("Canceled")}
                        >
                          <h4>{t("list.canceled")}</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="all">
                        {loadingGet ? (
                          <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>
                          </div>
                        ) : currentFilterOrder.length > 0 ? (
                          getSortedOrder(currentFilterOrder).map((order) => (
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
                                              {formatReadableDate(
                                                order.createdDate
                                              )}
                                            </p>
                                          </div>
                                        </li>
                                        <li className="order-status">
                                          {/* {getStatus(order.status)} */}
                                          {order.status === "IN_REQUEST" &&
                                            t("list.request")}
                                          {order.status === "IN_PROCESSING" &&
                                            t("list.process")}
                                          {order.status === "COMPLETED" &&
                                            t("list.complete")}
                                          {order.status === "CANCEL" &&
                                            t("list.canceled")}
                                        </li>
                                      </ul>
                                    </div>
                                    <div className="order-middle">
                                      <ul>
                                        {order.details.map((detail) =>
                                          detail.product ? (
                                            <li key={detail.productId}>
                                              <span className="order-middle-left">
                                                {detail.product.name} x{" "}
                                                {detail.quantity}
                                              </span>
                                              <span className="order-price">
                                                {detail.subtotal.toLocaleString(
                                                  "vi-VN"
                                                )}
                                                ₫
                                              </span>
                                            </li>
                                          ) : (
                                            ""
                                          )
                                        )}
                                      </ul>
                                    </div>

                                    <div className="order-total-wrap">
                                      <ul>
                                        <li>
                                          <span>Payment method</span>
                                          <span>{order.methodPaid}</span>
                                        </li>
                                        <li>
                                          <span className="order-total">
                                            {t("detail.total")}
                                          </span>
                                          <span className="order-total-price">
                                            {order.total.toLocaleString(
                                              "vi-VN"
                                            )}
                                            ₫
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="order-details-link">
                                    {order.status === "IN_REQUEST" ? (
                                      <button
                                        onClick={() =>
                                          clickCancel(
                                            order.id,
                                            order.methodPaid
                                          )
                                        }
                                      >
                                        Cancel
                                      </button>
                                    ) : order.rated ? (
                                      <button
                                        onClick={() => clickRated(order.id)}
                                      >
                                        Rated
                                      </button>
                                    ) : (
                                      order.status === "COMPLETED" && (
                                        <button
                                          onClick={() => clickRating(order.id)}
                                        >
                                          Rating
                                        </button>
                                      )
                                    )}
                                    <Link
                                      to={
                                        process.env.PUBLIC_URL +
                                        "/order/" +
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
                          ))
                        ) : (
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="item-empty-area text-center">
                                <div className="item-empty-area__icon mb-30">
                                  <i className="fa fa-file-text-o"></i>
                                </div>
                                <div className="item-empty-area__text">
                                  {t("list.no-order")}
                                  <br />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Tab.Pane>
                      <Tab.Pane eventKey="inRequest">
                        {currentFilterOrder.length > 0 ? (
                          getSortedOrder(currentFilterOrder).map((order) => (
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
                                              {formatReadableDate(
                                                order.createdDate
                                              )}
                                            </p>
                                          </div>
                                        </li>
                                        <li className="order-status">
                                          {/* {getStatus(order.status)} */}
                                          {order.status === "IN_REQUEST" &&
                                            t("list.request")}
                                        </li>
                                      </ul>
                                    </div>
                                    <div className="order-middle">
                                      <ul>
                                        {order.details.map((detail) => (
                                          <li key={detail.productId}>
                                            <span className="order-middle-left">
                                              {detail.product.name} x{" "}
                                              {detail.quantity}
                                            </span>
                                            <span className="order-price">
                                              {detail.subtotal.toLocaleString(
                                                "vi-VN"
                                              )}
                                              ₫
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="order-total-wrap">
                                      <ul>
                                        <li>
                                          <span>Payment method</span>
                                          <span>{order.methodPaid}</span>
                                        </li>
                                        <li>
                                          <span className="order-total">
                                            {t("detail.total")}
                                          </span>
                                          <span className="order-total-price">
                                            {order.total.toLocaleString(
                                              "vi-VN"
                                            )}
                                            ₫
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="order-details-link">
                                    {order.status === "IN_REQUEST" && (
                                      <button
                                        onClick={() =>
                                          clickCancel(
                                            order.id,
                                            order.methodPaid
                                          )
                                        }
                                      >
                                        Cancel
                                      </button>
                                    )}
                                    <Link
                                      to={
                                        process.env.PUBLIC_URL +
                                        "/order/" +
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
                          ))
                        ) : (
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="item-empty-area text-center">
                                <div className="item-empty-area__icon mb-30">
                                  <i className="fa fa-file-text-o"></i>
                                </div>
                                <div className="item-empty-area__text">
                                  {t("list.no-order")}
                                  <br />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Tab.Pane>
                      <Tab.Pane eventKey="processing">
                        {currentFilterOrder.length > 0 ? (
                          getSortedOrder(currentFilterOrder).map((order) => (
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
                                              {formatReadableDate(
                                                order.createdDate
                                              )}
                                            </p>
                                          </div>
                                        </li>
                                        <li className="order-status">
                                          {/* {getStatus(order.status)} */}
                                          {order.status === "IN_PROCESSING" &&
                                            t("list.process")}
                                        </li>
                                      </ul>
                                    </div>
                                    <div className="order-middle">
                                      <ul>
                                        {order.details.map((detail) => (
                                          <li key={detail.productId}>
                                            <span className="order-middle-left">
                                              {detail.product.name} x{" "}
                                              {detail.quantity}
                                            </span>
                                            <span className="order-price">
                                              {detail.subtotal.toLocaleString(
                                                "vi-VN"
                                              )}
                                              ₫
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="order-total-wrap">
                                      <ul>
                                        <li>
                                          <span>Payment method</span>
                                          <span>{order.methodPaid}</span>
                                        </li>
                                        <li>
                                          <span className="order-total">
                                            {t("detail.total")}
                                          </span>
                                          <span className="order-total-price">
                                            {order.total.toLocaleString(
                                              "vi-VN"
                                            )}
                                            ₫
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="order-details-link">
                                    <Link
                                      to={
                                        process.env.PUBLIC_URL +
                                        "/order/" +
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
                          ))
                        ) : (
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="item-empty-area text-center">
                                <div className="item-empty-area__icon mb-30">
                                  <i className="fa fa-file-text-o"></i>
                                </div>
                                <div className="item-empty-area__text">
                                  {t("list.no-order")}
                                  <br />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Tab.Pane>
                      <Tab.Pane eventKey="completed">
                        {currentFilterOrder.length > 0 ? (
                          getSortedOrder(currentFilterOrder).map((order) => (
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
                                              {formatReadableDate(
                                                order.createdDate
                                              )}
                                            </p>
                                          </div>
                                        </li>
                                        <li className="order-status">
                                          {/* {getStatus(order.status)} */}
                                          {order.status === "COMPLETED" &&
                                            t("list.complete")}
                                        </li>
                                      </ul>
                                    </div>
                                    <div className="order-middle">
                                      <ul>
                                        {order.details.map((detail) => (
                                          <li key={detail.productId}>
                                            <span className="order-middle-left">
                                              {detail.product.name} x{" "}
                                              {detail.quantity}
                                            </span>
                                            <span className="order-price">
                                              {detail.subtotal.toLocaleString(
                                                "vi-VN"
                                              )}
                                              ₫
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="order-total-wrap">
                                      <ul>
                                        <li>
                                          <span>Payment method</span>
                                          <span>{order.methodPaid}</span>
                                        </li>
                                        <li>
                                          <span className="order-total">
                                            {t("detail.total")}
                                          </span>
                                          <span className="order-total-price">
                                            {order.total.toLocaleString(
                                              "vi-VN"
                                            )}
                                            ₫
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="order-details-link">
                                    {order.rated ? (
                                      <button
                                        onClick={() => clickRated(order.id)}
                                      >
                                        Rated
                                      </button>
                                    ) : (
                                      order.status === "COMPLETED" && (
                                        <button
                                          onClick={() => clickRating(order.id)}
                                        >
                                          Rating
                                        </button>
                                      )
                                    )}
                                    <Link
                                      to={
                                        process.env.PUBLIC_URL +
                                        "/order/" +
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
                          ))
                        ) : (
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="item-empty-area text-center">
                                <div className="item-empty-area__icon mb-30">
                                  <i className="fa fa-file-text-o"></i>
                                </div>
                                <div className="item-empty-area__text">
                                  {t("list.no-order")}
                                  <br />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Tab.Pane>
                      <Tab.Pane eventKey="canceled">
                        {currentFilterOrder.length > 0 ? (
                          getSortedOrder(currentFilterOrder).map((order) => (
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
                                              {formatReadableDate(
                                                order.createdDate
                                              )}
                                            </p>
                                          </div>
                                        </li>
                                        <li className="order-status">
                                          {/* {getStatus(order.status)} */}
                                          {order.status === "CANCEL" &&
                                            t("list.canceled")}
                                        </li>
                                      </ul>
                                    </div>
                                    <div className="order-middle">
                                      <ul>
                                        {order.details.map((detail) => (
                                          <li key={detail.productId}>
                                            <span className="order-middle-left">
                                              {detail.product.name} x{" "}
                                              {detail.quantity}
                                            </span>
                                            <span className="order-price">
                                              {detail.subtotal.toLocaleString(
                                                "vi-VN"
                                              )}
                                              ₫
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="order-total-wrap">
                                      <ul>
                                        <li>
                                          <span>Payment method</span>
                                          <span>{order.methodPaid}</span>
                                        </li>
                                        <li>
                                          <span className="order-total">
                                            {t("detail.total")}
                                          </span>
                                          <span className="order-total-price">
                                            {order.total.toLocaleString(
                                              "vi-VN"
                                            )}
                                            ₫
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="order-details-link">
                                    <Link
                                      to={
                                        process.env.PUBLIC_URL +
                                        "/order/" +
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
                          ))
                        ) : (
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="item-empty-area text-center">
                                <div className="item-empty-area__icon mb-30">
                                  <i className="fa fa-file-text-o"></i>
                                </div>
                                <div className="item-empty-area__text">
                                  {t("list.no-order")}
                                  <br />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </Fragment>
          </div>
        </div>
      </LayoutOne>
      <Evaluate
        show={modalShow}
        onHide={() => setModalShow(false)}
        orderId={orderId}
        fetchData={fetchData}
      />
      <EditReview
        show={isEdit}
        onHide={() => setIsEdit(false)}
        orderId={orderId}
      />
      <CancelVnpay show={isCancelShow} onHide={() => setCancelShow(false)} />
    </Fragment>
  );
};

export default MyOrders;
