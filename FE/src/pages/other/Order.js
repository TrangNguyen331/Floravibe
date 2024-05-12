import React, { Fragment, useEffect, useState } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import axiosInstance from "../../axiosInstance";
import { useParams } from "react-router-dom";
import { formatReadableDate, getStatus } from "../../helpers/helper";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
const Order = ({ location, cartItems, currency }) => {
  console.log("Order details page");
  const [order, setOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const { id } = useParams();
  console.log(id);
  let cartTotalPrice = 0;

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
    getAllOrders();
  }, []);
  console.log(order);
  const { pathname } = location;

  const getAllOrders = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/orders");
      setOrders(response.data);
      console.log("orders", orders);
    } catch (error) {
      console.log("Fail to load my orders");
    }
  };
  const isFirstOrder = orders.length > 0 && orders[0].id === order.id;
  const {t} = useTranslation(['orders','breadcrumb']);

  return !order ? (
    ""
  ) : (
    <Fragment>
      <MetaTags>
        <title>Floravibe | {t('breadcrumb:order-details')}</title>
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/my-order"}>{t('breadcrumb:back')}</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>{t('breadcrumb:order-details')}</BreadcrumbsItem>

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
                              <p>{t('detail.id')} {order.id} </p>
                              <p className="order-datetime">
                                {t('detail.date')}{" "}
                                {formatReadableDate(order.createdDate)}
                              </p>
                            </div>
                          </li>

                          <li>
                            <div className="order-status-qty">
                              <p className="order-status">
                                {getStatus(order.status)}
                              </p>
                              <p>{order.details.length} {t('detail.products')}</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="order-bottom">
                        <ul>
                          <li>
                            <span className="order-bottom-left">{t('detail.shipping')}</span>
                            <span>{t('detail.free')}</span>
                          </li>
                          {isFirstOrder && (
                            <li className="mt-3">
                              <span className="order-bottom-left">
                                {t('detail.first-order')}
                              </span>
                              {order.details.forEach((detail) => {
                                cartTotalPrice += detail.subtotal;
                              })}
                              <span>
                                {"-" +
                                  (cartTotalPrice * 0.1).toLocaleString(
                                    "vi-VN"
                                  ) +
                                  "₫"}
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
                              {t('detail.pay-method')}
                            </span>
                            <span>{order.methodPaid}</span>
                          </li>
                        </ul>
                      </div>
                      <div className="order-bottom">
                        <ul>
                          <li>
                            <span className="order-bottom-left">
                              Your delivery date
                            </span>
                            <span>{order.deliveryDate}</span>
                          </li>
                        </ul>
                      </div>
                      <div className="order-total-wrap">
                        <ul>
                          <li className="order-total">{t('detail.total')}</li>
                          <li>{order.total.toLocaleString("vi-VN")}₫</li>
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
                        <h4>{t('detail.shipping-address')}</h4>
                      </div>
                      <div className="order-details-middle">
                        <ul>
                          <li>
                            <span>{t('detail.full-name')}</span>{" "}
                            {order.additionalOrder.fullName}
                          </li>
                          <li>
                            <span>{t('detail.address')}</span>
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
                            <span>{t('detail.phone')}</span> {order.additionalOrder.phone}
                          </li>
                          <li>
                            <span>Email:</span> {order.additionalOrder.email}
                          </li>
                        </ul>
                      </div>
                      <div className="order-bottom">
                        <ul>
                          <h4>{t('detail.order-note')}</h4>
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
                          <th>{t('detail.img')}</th>
                          <th>{t('detail.product-name')}</th>
                          <th>{t('detail.unit-price')}</th>
                          <th>{t('detail.qty')}</th>
                          <th>{t('detail.subtotal')}</th>
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
                                {detail.product.price.toLocaleString("vi-VN")}₫
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
Order.propTypes = {
  cartItems: PropTypes.array,
  currency: PropTypes.object,
  location: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    currency: state.currencyData,
  };
};

export default connect(mapStateToProps)(Order);
// export default Order;
