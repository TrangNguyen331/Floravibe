import PropTypes from "prop-types";
import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { connect } from "react-redux";
import { getDiscountPrice } from "../../helpers/product";
import {
  addToWishlist,
  deleteFromWishlist,
  deleteAllFromWishlist,
} from "../../redux/actions/wishlistActions";
import { addToCart } from "../../redux/actions/cartActions";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../axiosInstance";
import { useSelector } from "react-redux";
const Wishlist = ({
  location,
  cartItems,
  currency,
  addToCart,
  wishlistItems,
  deleteFromWishlist,
  deleteAllFromWishlist,
}) => {
  const { addToast } = useToasts();
  const { pathname } = location;
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/products/paging?size=999&page=0`
      );
      setProducts(response.data.content);
    } catch (error) {
      return [];
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  console.log("all products", products);
  const { t } = useTranslation(["wishlist", "breadcrumb", "home"]);
  const token = useSelector((state) => state.auth.token);
  const [myWishlist, setWishlist] = useState([]);
  const [alreadyGet, setAlreadyGet] = useState(false);
  const getWishlistItems = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/wishlist`);
      setWishlist(response.data.products);
      setAlreadyGet(true);
    } catch (error) {}
  };
  useEffect(() => {
    if (token && !alreadyGet) {
      getWishlistItems();
    }
  }, [token, alreadyGet]);

  const targetData = token && alreadyGet ? myWishlist : wishlistItems;

  const handleDeleteFromWishlist = async (wishlistItem) => {
    try {
      if (token) {
        await axiosInstance.delete(`/api/v1/wishlist/${wishlistItem.id}`);
      }
      deleteFromWishlist(wishlistItem, addToast);
      // Re-fetch wishlist items after deletion
      getWishlistItems();
    } catch (error) {
      console.error("Error deleting from wishlist:", error);
    }
  };
  const handleDeleteAll = async () => {
    try {
      deleteAllFromWishlist(addToast);
      if (token) {
        await axiosInstance.delete(`/api/v1/wishlist/clear`);
      }
      getWishlistItems();
    } catch (error) {}
  };
  return (
    <Fragment>
      <MetaTags>
        <title>Floravibe | {t("breadcrumb:wishlist")}</title>
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {t("breadcrumb:home")}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {t("breadcrumb:wishlist")}
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {targetData && targetData.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">Your wishlist items</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Unit Price</th>
                            <th>Add To Cart</th>
                            <th> </th>
                          </tr>
                        </thead>
                        <tbody>
                          {targetData.map((wishlistItem, key) => {
                            // const discountedPrice = getDiscountPrice(
                            //   wishlistItem.price,
                            //   wishlistItem.discount
                            // );
                            const finalProductPrice =
                              wishlistItem.price * currency.currencyRate;
                            // const finalDiscountedPrice = (
                            //   discountedPrice * currency.currencyRate
                            // ).toFixed(2);
                            const cartItem = cartItems.filter(
                              (item) => item.id === wishlistItem.id
                            )[0];
                            const productStock = products.some(
                              (product) => product.id === wishlistItem.id
                            )
                              ? products.find(
                                  (product) => product.id === wishlistItem.id
                                )
                              : null;
                            return (
                              <tr key={key}>
                                <td className="product-thumbnail">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      wishlistItem.id
                                    }
                                  >
                                    <img
                                      className="img-fluid"
                                      src={
                                        process.env.PUBLIC_URL +
                                        wishlistItem.images[0]
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
                                      wishlistItem.id
                                    }
                                  >
                                    {wishlistItem.name}
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
                                      "đ"}
                                  </span>
                                  {/* )} */}
                                </td>

                                <td className="product-wishlist-cart">
                                  {wishlistItem.affiliateLink ? (
                                    <a
                                      href={wishlistItem.affiliateLink}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                    >
                                      {t("home:productgrid.buy-now")}
                                    </a>
                                  ) : wishlistItem.variation &&
                                    wishlistItem.variation.length >= 1 ? (
                                    <Link
                                      to={`${process.env.PUBLIC_URL}/product/${wishlistItem.id}`}
                                    >
                                      {t("home:productgrid.select-option")}
                                    </Link>
                                  ) : productStock &&
                                    productStock.stockQty <= 0 ? (
                                    <button>out of stock</button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        addToCart(wishlistItem, addToast);
                                      }}
                                      className={
                                        cartItem !== undefined &&
                                        cartItem.quantity > 0
                                          ? "active"
                                          : ""
                                      }
                                      disabled={
                                        cartItem !== undefined &&
                                        cartItem.quantity > 0
                                        // (productStock &&
                                        //   productStock.stockQty <= 0)
                                      }
                                      title={
                                        wishlistItem !== undefined
                                          ? t(
                                              "home:productgrid.tooltip-added-to-cart"
                                            )
                                          : t(
                                              "home:productgrid.tooltip-add-to-cart"
                                            )
                                      }
                                    >
                                      {cartItem !== undefined &&
                                      cartItem.quantity > 0
                                        ? t("home:productgrid.added")
                                        : t("home:productgrid.add-to-cart")}
                                    </button>
                                  )}
                                </td>

                                <td className="product-remove">
                                  <button
                                    onClick={() => {
                                      handleDeleteFromWishlist(wishlistItem);
                                      // deleteFromWishlist(
                                      //   wishlistItem,
                                      //   addToast
                                      // );
                                    }}
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
                          {t("continue-shopping")}
                        </Link>
                      </div>
                      <div className="cart-clear">
                        <button
                          onClick={() => {
                            handleDeleteAll();
                            // deleteAllFromWishlist(addToast);
                          }}
                        >
                          {t("clear-wishlist")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-like"></i>
                    </div>
                    <div className="item-empty-area__text">
                      {t("no-item")} <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop"}>
                        {t("add-item")}
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

Wishlist.propTypes = {
  addToCart: PropTypes.func,
  cartItems: PropTypes.array,
  currency: PropTypes.object,
  location: PropTypes.object,
  deleteAllFromWishlist: PropTypes.func,
  deleteFromWishlist: PropTypes.func,
  wishlistItems: PropTypes.array,
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    currency: state.currencyData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item, addToast, quantityCount) => {
      dispatch(addToCart(item, addToast, quantityCount));
    },
    addToWishlist: (item, addToast, quantityCount) => {
      dispatch(addToWishlist(item, addToast, quantityCount));
    },
    deleteFromWishlist: (item, addToast, quantityCount) => {
      dispatch(deleteFromWishlist(item, addToast, quantityCount));
    },
    deleteAllFromWishlist: (addToast) => {
      dispatch(deleteAllFromWishlist(addToast));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
