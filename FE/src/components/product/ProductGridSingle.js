import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import ProductModal from "./ProductModal";
import { useTranslation } from "react-i18next";
import ProductAverageRating from "./sub-components/ProductAverageRating";
const ProductGridSingle = ({
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
  const finalProductPrice = +product.price.toFixed(2);
  // const finalDiscountedPrice = +(
  //   discountedPrice * currency.currencyRate
  // ).toFixed(2);
  // const handleAddToWishList = async () => {
  //   try {
  //     if (token) {
  //       await axiosInstance.post(`/api/v1/wishlist/${product.id}`);
  //     }
  //     addToWishlist(product, addToast);
  //   } catch (err) {
  //     addToast("failed", {
  //       appearance: "error",
  //       autoDismiss: true,
  //     });
  //   }
  // };
  return (
    <Fragment>
      <div
        className={`col-xl-3 col-md-6 col-lg-4 col-sm-6 ${
          sliderClassName ? sliderClassName : ""
        }`}
      >
        <div
          className={`product-wrap ${spaceBottomClass ? spaceBottomClass : ""}`}
        >
          <div className="product-img">
            <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
              <img
                className="default-img"
                src={
                  product.images
                    ? process.env.PUBLIC_URL + product.images[0]
                    : ""
                }
                alt=""
              />
              {product.images.length > 1 ? (
                <img
                  className="hover-img"
                  src={
                    product.images && product.images.length > 1
                      ? process.env.PUBLIC_URL + product.images[1]
                      : ""
                  }
                  alt=""
                />
              ) : (
                ""
              )}
            </Link>
            {product.stockQty === 0 ? (
              <div className="product-img-badges">
                <span className="sold-out">sold out</span>
              </div>
            ) : (
              ""
            )}

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
                    addToWishlist(product, addToast);
                    // handleAddToWishList();
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
                      addToCart(product, addToast);
                    }}
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
            <div className="product-rating">
              <ProductAverageRating product={product} />
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

ProductGridSingle.propTypes = {
  addToCart: PropTypes.func,
  addToWishlist: PropTypes.func,
  cartItem: PropTypes.object,
  currency: PropTypes.object,
  product: PropTypes.object,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  wishlistItem: PropTypes.object,
};

export default ProductGridSingle;
