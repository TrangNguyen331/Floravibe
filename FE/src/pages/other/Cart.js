import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { connect } from "react-redux";
import { getDiscountPrice } from "../../helpers/product";
import {
  addToCart,
  decreaseQuantity,
  deleteFromCart,
  cartItemStock,
  deleteAllFromCart,
} from "../../redux/actions/cartActions";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../axiosInstance";
const Cart = ({
  location,
  cartItems,
  currency,
  decreaseQuantity,
  addToCart,
  deleteFromCart,
  deleteAllFromCart,
}) => {
  const [quantityCount] = useState(1);
  const { addToast } = useToasts();
  const { pathname } = location;
  let cartTotalPrice = 0;
  let totalProduct = cartItems.reduce(
    (total, product) => total + product.quantity,
    0
  );
  const { t } = useTranslation(["orders", "breacrumb"]);
  const [productStock, setProductStock] = useState(null);
  const [products, setProducts] = useState([]);
  const [alreadyGet, setAlreadyGet] = useState(false);
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/products/paging?size=999&page=0`
      );
      setProducts(response.data.content);
      setAlreadyGet(true);
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  useEffect(() => {
    if (alreadyGet) {
      // Find the product in products array and set its stockQty to productStock
      const result = products.some((item) =>
        cartItems.some((cartItem) => cartItem.id === item.id)
      )
        ? products.find((item) =>
            cartItems.some((cartItem) => cartItem.id === item.id)
          ).stockQty
        : null;

      setProductStock(result);
    }
  }, [alreadyGet, cartItems, products]);
  return (
    <Fragment>
      <MetaTags>
        <title>Floravibe | {t("beadcrumb:cart")}</title>
        <meta name="Cart" content="Cart" />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {t("beadcrumb:home")}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {t("beadcrumb:cart")}
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        {cartItems && cartItems.length >= 1 ? (
          <div className="container mt-5">
            <ul className="progressbar">
              <li className="active">{t("cart.shopping-cart")}</li>
              <li>{t("complete.checkout")}</li>
              <li>{t("complete.order-complete")}</li>
            </ul>
          </div>
        ) : (
          ""
        )}

        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">{t("cart.your-cart-item")}</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>{t("detail.img")}</th>
                            <th>{t("detail.product-name")}</th>
                            <th>{t("detail.unit-price")}</th>
                            <th>{t("detail.qty")}</th>
                            <th>{t("detail.stockQty")}</th>
                            <th>{t("detail.subtotal")}</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((cartItem, key) => {
                            // const discountedPrice = getDiscountPrice(
                            //   cartItem.price,
                            //   cartItem.discount
                            // );
                            const finalProductPrice =
                              cartItem.price * currency.currencyRate;
                            // const finalDiscountedPrice = (
                            //   discountedPrice * currency.currencyRate
                            // ).toFixed(2);

                            // discountedPrice != null
                            //   ? (cartTotalPrice +=
                            //       finalDiscountedPrice * cartItem.quantity):
                            cartTotalPrice +=
                              finalProductPrice * cartItem.quantity;
                            return (
                              <tr key={key}>
                                <td className="product-thumbnail">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      cartItem.id
                                    }
                                  >
                                    <img
                                      className="img-fluid"
                                      src={
                                        process.env.PUBLIC_URL +
                                        cartItem.images[0]
                                      }
                                      alt=""
                                    />
                                  </Link>
                                </td>

                                <td className="product-name text-center">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      cartItem.id
                                    }
                                  >
                                    {cartItem.name}
                                  </Link>
                                </td>

                                <td className="product-price-cart">
                                  {/* {discountedPrice !== null ? (
                                    <Fragment>
                                      <span className="amount old">
                                        {currency.currencySymbol +
                                          finalProductPrice}
                                      </span>
                                      <span className="amount">
                                        {currency.currencySymbol +
                                          finalDiscountedPrice}
                                      </span>
                                    </Fragment>
                                  ) : ( */}
                                  <span className="amount">
                                    {finalProductPrice.toLocaleString("vi-VN") +
                                      "₫"}
                                  </span>
                                  {/* )} */}
                                </td>

                                <td className="product-quantity">
                                  <div className="cart-plus-minus">
                                    <button
                                      className="dec qtybutton"
                                      onClick={() => {
                                        decreaseQuantity(cartItem, addToast);
                                      }}
                                    >
                                      -
                                    </button>
                                    <input
                                      className="cart-plus-minus-box"
                                      type="text"
                                      value={cartItem.quantity}
                                      readOnly
                                    />
                                    <button
                                      className="inc qtybutton"
                                      onClick={() => {
                                        addToCart(
                                          cartItem,
                                          addToast,
                                          quantityCount
                                        );
                                      }}
                                      disabled={
                                        cartItem.quantity === productStock
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                                <td className="product-subtotal">
                                  {alreadyGet &&
                                  products.some(
                                    (item) => item.id === cartItem.id
                                  )
                                    ? products.find(
                                        (item) => item.id === cartItem.id
                                      ).stockQty
                                    : null}
                                </td>
                                <td className="product-subtotal">
                                  {/* {discountedPrice !== null
                                    ? currency.currencySymbol +
                                      (
                                        finalDiscountedPrice * cartItem.quantity
                                      ).toFixed(2)
                                    :  */}
                                  {(
                                    finalProductPrice * cartItem.quantity
                                  ).toLocaleString("vi-VN") + "₫"}
                                </td>

                                <td className="product-remove">
                                  <button
                                    onClick={() =>
                                      deleteFromCart(cartItem, addToast)
                                    }
                                  >
                                    <i className="fa fa-times"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link to={process.env.PUBLIC_URL + "/shop"}>
                          {t("cart.continue-shopping")}
                        </Link>
                      </div>
                      <div className="cart-clear">
                        <button onClick={() => deleteAllFromCart(addToast)}>
                          {t("cart.clear-shopping-cart")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {/* <div className="col-lg-4 col-md-6"></div> */}
                  <div className="col-lg-12">
                    <div className="grand-totall">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gary-cart">
                          {t("cart.cart-total")}
                        </h4>
                      </div>
                      <h5>
                        {t("cart.total-product")}
                        <span>
                          {totalProduct + " " + t("cart.item")}
                          {/* {cartTotalPrice.toLocaleString("vi-VN") +
                            currency.currencySymbol} */}
                        </span>
                      </h5>

                      <h4 className="grand-totall-title">
                        {t("cart.grand-total")}
                        <span>
                          {cartTotalPrice.toLocaleString("vi-VN") + "₫"}
                        </span>
                      </h4>
                      <Link to={process.env.PUBLIC_URL + "/checkout"}>
                        {t("cart.process-checkout")}
                      </Link>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cart"></i>
                    </div>
                    <div className="item-empty-area__text">
                      {t("cart.no-item")} <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop"}>
                        {t("cart.shop-now")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

Cart.propTypes = {
  addToCart: PropTypes.func,
  cartItems: PropTypes.array,
  currency: PropTypes.object,
  decreaseQuantity: PropTypes.func,
  location: PropTypes.object,
  deleteAllFromCart: PropTypes.func,
  deleteFromCart: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    currency: state.currencyData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item, addToast, quantityCount) => {
      dispatch(addToCart(item, addToast, quantityCount));
    },
    decreaseQuantity: (item, addToast) => {
      dispatch(decreaseQuantity(item, addToast));
    },
    deleteFromCart: (item, addToast) => {
      dispatch(deleteFromCart(item, addToast));
    },
    deleteAllFromCart: (addToast) => {
      dispatch(deleteAllFromCart(addToast));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
