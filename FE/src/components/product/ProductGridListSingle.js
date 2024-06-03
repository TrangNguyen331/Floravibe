import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
// import { getDiscountPrice } from "../../helpers/product";
import Rating from "./sub-components/ProductRating";
import ProductModal from "./ProductModal";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../axiosInstance";
import ProductAverageRating from "./sub-components/ProductAverageRating";
const ProductGridListSingle = ({
  product,
  currency,
  addToCart,
  addToWishlist,
  cartItem,
  wishlistItem,
  sliderClassName,
  spaceBottomClass,
}) => {
  const { t } = useTranslation(["home"]);
  const [modalShow, setModalShow] = useState(false);
  const { addToast } = useToasts();
  const finalProductPrice = +(product.price * currency.currencyRate).toFixed(2);
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const handleAddToWishList = async () => {
    try {
      if (token) {
        await axiosInstance.post(`/api/v1/wishlist/${product.id}`);
      }
      addToWishlist(product, addToast);
    } catch (err) {
      addToast("failed", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  const truncateContent = (content) => {
    return content.length > 180 ? content.substr(0, 180) + "..." : content;
  };
  return (
    <Fragment>
      <div
        className={`col-xl-4 col-sm-6 ${
          sliderClassName ? sliderClassName : ""
        }`}
      >
        <div
          className={`product-wrap ${spaceBottomClass ? spaceBottomClass : ""}`}
        >
          <div className="product-img">
            <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
              <img className="default-img" src={product.images[0]} alt="" />
              {product.images.length > 1 ? (
                <img className="hover-img" src={product.images[1]} alt="" />
              ) : (
                ""
              )}
            </Link>

            <div className="product-action">
              <div className="pro-same-action pro-wishlist">
                <button
                  className={wishlistItem !== undefined ? "active" : ""}
                  disabled={wishlistItem !== undefined}
                  title={
                    wishlistItem !== undefined
                      ? t("productgrid.added-to-wishlist")
                      : t("productgrid.add-to-wishlist")
                  }
                  onClick={() => {
                    if (token) {
                      // addToWishlist(product, addToast);
                      handleAddToWishList();
                    } else {
                      history.push("/login-register");
                    }
                  }}
                >
                  <i className="pe-7s-like" />
                </button>
              </div>
              <div className="pro-same-action pro-cart">
                {product.affiliateLink ? (
                  <a
                    href={product.affiliateLink}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {" "}
                    {t("productgrid.buy-now")}{" "}
                  </a>
                ) : product.variation && product.variation.length >= 1 ? (
                  <Link to={`${process.env.PUBLIC_URL}/product/${product.id}`}>
                    {t("productgrid.select-option")}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      if (token) {
                        addToCart(product, addToast);
                      } else {
                        history.push("/login-register");
                      }
                    }}
                    className={
                      cartItem !== undefined && cartItem.quantity > 0
                        ? "active"
                        : ""
                    }
                    disabled={
                      (cartItem !== undefined && cartItem.quantity > 0) ||
                      product.stockQty === 0
                    }
                    title={
                      cartItem !== undefined
                        ? t("productgrid.tooltip-added-to-cart")
                        : t("productgrid.tooltip-add-to-cart")
                    }
                  >
                    {" "}
                    <i className="pe-7s-cart"></i>{" "}
                    {cartItem !== undefined && cartItem.quantity > 0
                      ? t("productgrid.added")
                      : t("productgrid.add-to-cart")}
                  </button>
                )}
              </div>
              <div className="pro-same-action pro-quickview">
                <button
                  onClick={() => setModalShow(true)}
                  title={t("productgrid.quick-view")}
                >
                  <i className="pe-7s-look" />
                </button>
              </div>
            </div>
          </div>
          <div className="product-content text-center">
            <h3>
              <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                {product.name}
              </Link>
            </h3>
            <div className="product-price">
              <span>{finalProductPrice.toLocaleString("vi-VN") + "₫"} </span>
            </div>
          </div>
        </div>
        <div className="shop-list-wrap mb-30">
          <div className="row">
            <div className="col-xl-4 col-md-5 col-sm-6">
              <div className="product-list-image-wrap">
                <div className="product-img">
                  <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                    <img
                      className="default-img img-fluid"
                      src={product.images[0]}
                      alt=""
                    />
                    {product.images.length > 1 ? (
                      <img
                        className="hover-img img-fluid"
                        src={process.env.PUBLIC_URL + product.images[1]}
                        alt=""
                      />
                    ) : (
                      ""
                    )}
                  </Link>
                  {product.discount || product.new ? (
                    <div className="product-img-badges">
                      {product.discount ? (
                        <span className="pink">-{product.discount}%</span>
                      ) : (
                        ""
                      )}
                      {product.new ? <span className="purple">New</span> : ""}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="col-xl-8 col-md-7 col-sm-6">
              <div className="shop-list-content">
                <h3>
                  <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                    {product.name}
                  </Link>
                </h3>
                <div className="product-list-price">
                  <span>{finalProductPrice.toLocaleString("vi-VN") + "₫"}</span>
                </div>

                <div className="rating-review">
                  <div className="product-list-rating">
                    <ProductAverageRating product={product} />
                  </div>
                </div>

                {product.description ? (
                  <p>{truncateContent(product.description)}</p>
                ) : (
                  ""
                )}

                <div className="shop-list-actions d-flex align-items-center">
                  <div className="shop-list-btn btn-hover">
                    {product.affiliateLink ? (
                      <a
                        href={product.affiliateLink}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {" "}
                        {t("productgrid.buy-now")}{" "}
                      </a>
                    ) : product.variation && product.variation.length >= 1 ? (
                      <Link
                        to={`${process.env.PUBLIC_URL}/product/${product.id}`}
                      >
                        {t("productgrid.select-option")}
                      </Link>
                    ) : (
                      <button
                        onClick={() => addToCart(product, addToast)}
                        className={
                          cartItem !== undefined && cartItem.quantity > 0
                            ? "active"
                            : ""
                        }
                        disabled={
                          (cartItem !== undefined && cartItem.quantity > 0) ||
                          product.stockQty <= 0
                        }
                        title={
                          cartItem !== undefined
                            ? t("productgrid.tooltip-added-to-cart")
                            : t("productgrid.tooltip-add-to-cart")
                        }
                      >
                        <i className="pe-7s-cart"></i>{" "}
                        {cartItem !== undefined && cartItem.quantity > 0
                          ? t("productgrid.added")
                          : t("productgrid.add-to-cart")}
                      </button>
                    )}
                  </div>

                  <div className="shop-list-wishlist ml-10">
                    <button
                      // className={wishlistItem !== undefined ? "active" : ""}
                      disabled={wishlistItem !== undefined}
                      title={
                        wishlistItem !== undefined
                          ? t("productgrid.added-to-wishlist")
                          : t("productgrid.add-to-wishlist")
                      }
                      onClick={() => addToWishlist(product, addToast)}
                    >
                      {wishlistItem !== undefined ? (
                        <i
                          className="fa fa-heart"
                          style={{ color: "#a749ff" }}
                        />
                      ) : (
                        <i className="fa fa-heart-o" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        currency={currency}
        finalproductprice={finalProductPrice}
        cartitem={cartItem}
        wishlistitem={wishlistItem}
        addtocart={addToCart}
        addtowishlist={addToWishlist}
        addtoast={addToast}
      />
    </Fragment>
  );
};

ProductGridListSingle.propTypes = {
  addToCart: PropTypes.func,
  addToWishlist: PropTypes.func,
  cartItem: PropTypes.object,
  currency: PropTypes.object,
  product: PropTypes.object,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  wishlistItem: PropTypes.object,
};

export default ProductGridListSingle;
