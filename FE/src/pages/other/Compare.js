import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { connect } from "react-redux";
import { addToCart } from "../../redux/actions/cartActions";
import { deleteFromCompare } from "../../redux/actions/compareActions";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ProductAverageRating from "../../components/product/sub-components/ProductAverageRating";
import axiosInstance from "../../axiosInstance";
import { useTranslation } from "react-i18next";
const Compare = ({
  location,
  cartItems,
  compareItems,
  addToCart,
  deleteFromCompare,
  currency,
}) => {
  const { pathname } = location;
  const { addToast } = useToasts();
  const { t } = useTranslation(["home"]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/v1/products/allProducts`
        );
        setProducts(response.data);
      } catch (error) {
        return [];
      }
    };
    fetchProducts();
  }, []);
  return (
    <Fragment>
      <MetaTags>
        <title>Compare</title>
        <meta name="Compare" content="Compare" />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Compare
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="compare-main-area pt-90 pb-100">
          <div className="container">
            {compareItems && compareItems.length >= 1 ? (
              <div className="row">
                <div className="col-lg-12">
                  <div className="compare-page-content">
                    <div className="compare-table table-responsive">
                      <table className="table table-bordered mb-0">
                        <tbody>
                          <tr>
                            <th className="title-column">PRODUCT INFO</th>
                            {compareItems.map((compareItem, key) => {
                              const cartItem = cartItems.filter(
                                (item) => item.id === compareItem.id
                              )[0];
                              const productStock = products.some(
                                (product) => product.id === compareItem.id
                              )
                                ? products.find(
                                    (product) => product.id === compareItem.id
                                  )
                                : null;
                              return (
                                <td className="product-image-title" key={key}>
                                  <div className="compare-remove">
                                    <button
                                      onClick={() =>
                                        deleteFromCompare(compareItem, addToast)
                                      }
                                    >
                                      <i className="pe-7s-trash" />
                                    </button>
                                  </div>
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      compareItem.id
                                    }
                                    className="image"
                                  >
                                    <img
                                      className="img-fluid"
                                      src={
                                        process.env.PUBLIC_URL +
                                        compareItem.images[0]
                                      }
                                      alt=""
                                    />
                                  </Link>
                                  <div className="product-title">
                                    <Link
                                      to={
                                        process.env.PUBLIC_URL +
                                        "/product/" +
                                        compareItem.id
                                      }
                                    >
                                      {compareItem.name}
                                    </Link>
                                  </div>
                                  <div className="compare-btn">
                                    {productStock &&
                                    productStock.stockQty > 0 ? (
                                      <button
                                        onClick={() =>
                                          addToCart(compareItem, addToast)
                                        }
                                        className={
                                          cartItem !== undefined &&
                                          cartItem.quantity > 0
                                            ? "active"
                                            : ""
                                        }
                                        disabled={
                                          cartItem !== undefined &&
                                          cartItem.quantity > 0
                                        }
                                        title={
                                          compareItem !== undefined
                                            ? "Added to cart"
                                            : "Add to cart"
                                        }
                                      >
                                        {cartItem !== undefined &&
                                        cartItem.quantity > 0
                                          ? t("home:productgrid.added")
                                          : t("home:productgrid.add-to-cart")}
                                      </button>
                                    ) : (
                                      <button disabled className="active">
                                        {t("home:productgrid.out-of-stock")}
                                      </button>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                          <tr>
                            <th className="title-column">PRICE</th>
                            {compareItems.map((compareItem, key) => {
                              return (
                                <td className="product-price" key={key}>
                                  <span className="amount">
                                    {compareItem.price.toLocaleString("vi-VN") +
                                      "đ"}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                          <tr>
                            <th className="title-column">ADDITIONAL INFO</th>
                            {compareItems.map((compareItem, key) => {
                              return (
                                <td className="product-desc" key={key}>
                                  {compareItem.additionalInformation ? (
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          compareItem.additionalInformation,
                                      }}
                                    ></p>
                                  ) : (
                                    "N/A"
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                          <tr>
                            <th className="title-column">TAG</th>
                            {compareItems.map((compareItem, key) => {
                              return (
                                <td className="product-desc" key={key}>
                                  <ul>
                                    {compareItem.tags.length > 0
                                      ? compareItem.tags.map((tag) => (
                                          <li key={tag.id}>{tag.name}</li>
                                        ))
                                      : ""}
                                  </ul>
                                </td>
                              );
                            })}
                          </tr>
                          <tr>
                            <th className="title-column">RATING</th>
                            {compareItems.map((compareItem, key) => {
                              return (
                                <td className="product-rating" key={key}>
                                  <ProductAverageRating product={compareItem} />
                                  <br />({compareItem.reviews.length} reviews)
                                </td>
                              );
                            })}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-shuffle"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in compare <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                        Add Items
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

Compare.propTypes = {
  addToCart: PropTypes.func,
  cartItems: PropTypes.array,
  compareItems: PropTypes.array,
  currency: PropTypes.object,
  location: PropTypes.object,
  deleteFromCompare: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    compareItems: state.compareData,
    currency: state.currencyData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item, addToast, quantityCount) => {
      dispatch(addToCart(item, addToast, quantityCount));
    },

    deleteFromCompare: (item, addToast) => {
      dispatch(deleteFromCompare(item, addToast));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Compare);
