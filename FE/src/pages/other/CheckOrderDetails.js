import React, { Fragment, useEffect, useState } from "react";
import { formatReadableDate, getStatus } from "../../helpers/helper";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../axiosInstance";
import { useParams } from "react-router-dom";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
const CheckOrderDetails = ({ location }) => {
  const { t } = useTranslation(["orders"]);
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  const { pathname } = location;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/orders/" + id);
        console.log("order", response.data);
        setOrder(response.data);
      } catch (error) {
        console.log("Fail to load Order");
      }
    };

    fetchData();
  }, []);
  return !order ? (
    ""
  ) : (
    <Fragment>
      <MetaTags>
        <title>Floravibe | {t("breadcrumb:order-details")}</title>
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/check-order"}>
        {t("breadcrumb:back")}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {t("breadcrumb:order-details")}
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
                              <p>
                                {t("detail.id")} {order.id}{" "}
                              </p>
                              <p className="order-datetime">
                                {t("detail.date")}{" "}
                                {formatReadableDate(order.createdDate)}
                              </p>
                              {order.status === "CANCEL" && (
                                <p className="order-datetime">
                                  {t("detail.cancel-time")}{" "}
                                  {formatReadableDate(
                                    order.cancelDetail.cancelDate
                                  )}
                                </p>
                              )}
                            </div>
                          </li>

                          <li>
                            <div className="order-status-qty">
                              <p className="order-status">
                                {getStatus(order.status)}
                              </p>
                              <p>
                                {order.details.length} {t("detail.products")}
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="order-bottom">
                        <ul>
                          <li>
                            <span className="order-bottom-left">
                              {t("detail.shipping")}
                            </span>
                            <span>{t("detail.free")}</span>
                          </li>
                          {order.firstDiscount > 0 && (
                            <li className="mt-3">
                              <span className="order-bottom-left">
                                {t("detail.first-order")}
                              </span>

                              <span>
                                {"-" + (50000).toLocaleString("vi-VN") + "₫"}
                              </span>
                            </li>
                          )}
                          {order.voucherDetail.id && (
                            <li>
                              <span className="order-bottom-left">Voucher</span>
                              <span>
                                {"-" + order.voucherDetail.voucherValue}₫
                              </span>
                            </li>
                          )}

                          <li>
                            <span className="order-bottom-left">
                              {t("detail.pay-method")}
                            </span>
                            <span>{order.methodPaid}</span>
                          </li>
                        </ul>
                      </div>
                      {/* <div className="order-bottom">
                        <ul>
                          <li>
                            <span className="order-bottom-left">
                              Your delivery date
                            </span>
                            <span>
                              {new Date(order.deliveryDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </li>
                          <li>
                            <span className="order-bottom-left">
                              Your delivery time
                            </span>
                            <span>{order.deliveryTime}</span>
                          </li>
                        </ul>
                      </div> */}
                      <div className="order-total-wrap">
                        <ul>
                          {/* <li className="order-total">{t("detail.total")}</li>
                          <li>{order.total.toLocaleString("vi-VN")}₫</li> */}
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
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-4">
                  <div className="order-wrap">
                    <div className="order-product-info">
                      <div className="order-top">
                        <h4>{t("detail.shipping-address")}</h4>
                      </div>
                      <div className="order-details-middle">
                        <ul>
                          <li>
                            <span>{t("detail.full-name")}</span>{" "}
                            {order.additionalOrder.fullName}
                          </li>
                          <li>
                            <span>{t("detail.address")}</span>
                          </li>
                          <li>
                            <p>
                              {order.additionalOrder.houseNumber},{" "}
                              {order.additionalOrder.ward},{" "}
                              {order.additionalOrder.district},{" "}
                              {order.additionalOrder.city}
                            </p>
                          </li>
                          <li>
                            <span>{t("detail.phone")}</span>{" "}
                            {order.additionalOrder.phone}
                          </li>
                          <li>
                            <span>Email:</span> {order.additionalOrder.email}
                          </li>
                        </ul>
                      </div>
                      <div className="order-bottom">
                        <ul>
                          <li>
                            <span className="order-bottom-left">
                              {t("detail.order-deli-date")}
                            </span>
                            <span>
                              {new Date(order.deliveryDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </li>
                          <li>
                            <span className="order-bottom-left">
                              {t("detail.order-deli-time")}
                            </span>
                            <span>{order.deliveryTime}</span>
                          </li>
                        </ul>
                      </div>
                      {order.additionalOrder.additionalInformation && (
                        <div className="order-bottom">
                          <ul>
                            <h4>{t("detail.order-note")}</h4>
                            <li>
                              <p>
                                {order.additionalOrder.additionalInformation}
                              </p>
                            </li>
                          </ul>
                        </div>
                      )}
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
                          <th>{t("detail.img")}</th>
                          <th>{t("detail.product-name")}</th>
                          <th>{t("detail.unit-price")}</th>
                          <th>{t("detail.qty")}</th>
                          <th>{t("detail.subtotal")}</th>
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
                                {detail.unitPrice.toLocaleString("vi-VN")}₫
                              </span>
                            </td>
                            <td className="product-quantity text-center">
                              x{detail.quantity}
                            </td>
                            <td className="product-subtotal">
                              {detail.subtotal.toLocaleString("vi-VN")}₫
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

export default CheckOrderDetails;
