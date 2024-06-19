import PropTypes from "prop-types";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getProductCartQuantity } from "../../helpers/product";
import { addToCart } from "../../redux/actions/cartActions";
import { addToWishlist } from "../../redux/actions/wishlistActions";
import { addToCompare } from "../../redux/actions/compareActions";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../axiosInstance";
import ProductAverageRating from "./sub-components/ProductAverageRating";

const ProductDescriptionInfo = ({
  product,
  discountedPrice,
  currency,
  finalDiscountedPrice,
  finalProductPrice,
  cartItems,
  wishlistItem,
  compareItem,
  addToast,
  addToCart,
  addToWishlist,
  addToCompare,
}) => {
  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variation ? product.variation[0].color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variation ? product.variation[0].size[0].name : ""
  );
  const [productStock, setProductStock] = useState(
    product.variation ? product.variation[0].size[0].stock : product.stock
  );
  const [quantityCount, setQuantityCount] = useState(1);

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const { t } = useTranslation(["product", "home"]);

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
    <div className="product-details-content ml-70">
      <h2 style={{ fontSize: "28px" }}>{product.name}</h2>
      <div className="product-details-price">
        {/* {discountedPrice !== null ? (
          <Fragment>
            <span>{finalDiscountedPrice + " " + currency.currencySymbol}</span>{" "}
            <span className="old">
              {finalProductPrice + " " + currency.currencySymbol}
            </span>
          </Fragment>
        ) : ( */}
        <span>{finalProductPrice.toLocaleString("vi-VN") + "₫"}</span>
        {/* )} */}
      </div>

      <div className="pro-details-rating-wrap">
        <div className="pro-details-rating">
          <ProductAverageRating product={product} /> ({product.reviews.length}{" "}
          reviews)
        </div>
      </div>

      <div className="pro-details-list">
        <p>{product.description}</p>
      </div>

      {product.variation ? (
        <div className="pro-details-size-color">
          <div className="pro-details-color-wrap">
            <span>{t("detail.color")}</span>
            <div className="pro-details-color-content">
              {product.variation.map((single, key) => {
                return (
                  <label
                    className={`pro-details-color-content--single ${single.color}`}
                    key={key}
                  >
                    <input
                      type="radio"
                      value={single.color}
                      name="product-color"
                      checked={
                        single.color === selectedProductColor ? "checked" : ""
                      }
                      onChange={() => {
                        setSelectedProductColor(single.color);
                        setSelectedProductSize(single.size[0].name);
                        setProductStock(single.size[0].stock);
                        setQuantityCount(1);
                      }}
                    />
                    <span className="checkmark"></span>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="pro-details-size">
            <span>{t("detail.size")}</span>
            <div className="pro-details-size-content">
              {product.variation &&
                product.variation.map((single) => {
                  return single.color === selectedProductColor
                    ? single.size.map((singleSize, key) => {
                        return (
                          <label
                            className={`pro-details-size-content--single`}
                            key={key}
                          >
                            <input
                              type="radio"
                              value={singleSize.name}
                              checked={
                                singleSize.name === selectedProductSize
                                  ? "checked"
                                  : ""
                              }
                              onChange={() => {
                                setSelectedProductSize(singleSize.name);
                                setProductStock(singleSize.stock);
                                setQuantityCount(1);
                              }}
                            />
                            <span className="size-name">{singleSize.name}</span>
                          </label>
                        );
                      })
                    : "";
                })}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {product.affiliateLink ? (
        <div className="pro-details-quality">
          <div className="pro-details-cart btn-hover ml-0">
            <a
              href={product.affiliateLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              {t("detail.buy-now")}
            </a>
          </div>
        </div>
      ) : (
        <div className="pro-details-quality">
          <div
            className={`cart-plus-minus ${
              quantityCount > product.stockQty ||
              productCartQty + quantityCount > product.stockQty
                ? "warning"
                : ""
            }`}
          >
            <button
              onClick={() =>
                setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)
              }
              className="dec qtybutton"
            >
              -
            </button>
            <input
              className="cart-plus-minus-box"
              type="text"
              value={quantityCount}
              readOnly
            />
            <button
              onClick={() => setQuantityCount(quantityCount + 1)}
              className="inc qtybutton"
            >
              +
            </button>
          </div>
          <div className="pro-details-cart btn-hover">
            {
              <button
                onClick={() => {
                  addToCart(
                    product,
                    addToast,
                    quantityCount,
                    selectedProductColor,
                    selectedProductSize
                  );
                }}
                disabled={
                  productCartQty >= product.stockQty ||
                  product.stockQty <= 0 ||
                  quantityCount > product.stockQty ||
                  productCartQty + quantityCount > product.stockQty
                }
              >
                {t("home:productgrid.add-to-cart")}
              </button>
            }
          </div>
          <div className="pro-details-wishlist">
            <button
              disabled={wishlistItem !== undefined}
              title={
                wishlistItem
                  ? t("home:productgrid.added-to-wishlist")
                  : t("home:productgrid.add-to-wishlist")
              }
              onClick={() => {
                addToWishlist(product, addToast);
                // handleAddToWishList();
              }}
            >
              {wishlistItem ? (
                <i className="fa fa-heart" style={{ color: "#a749ff" }} />
              ) : (
                <i className="fa fa-heart-o" />
              )}
            </button>
          </div>
          <div className="pro-details-compare">
            <button
              className={compareItem !== undefined ? "active" : ""}
              disabled={compareItem !== undefined}
              title={
                compareItem !== undefined
                  ? "Added to compare"
                  : "Add to compare"
              }
              onClick={() => addToCompare(product, addToast)}
            >
              <i className="pe-7s-shuffle" />
            </button>
          </div>
        </div>
      )}
      <div
        className={`pro-details-stock ${
          product.stockQty === 0 ? "out-of-stock" : ""
        }`}
      >
        Current stock: {product.stockQty}
      </div>
      {product.collections ? (
        <div className="pro-details-meta">
          <span>{t("detail.categories")}:</span>
          <ul>
            {product.collections.map((single, key) => {
              return <li key={single.id}>{single.name}</li>;
            })}
          </ul>
        </div>
      ) : (
        ""
      )}
      {product.tags ? (
        <div className="pro-details-meta">
          <span>{t("sidebar.tag")}:</span>
          <ul>
            {product.tags.map((single, key) => {
              return <li key={key}>{single.name}</li>;
            })}
          </ul>
        </div>
      ) : (
        ""
      )}

      <div className="pro-details-social">
        <ul>
          <li>
            <a href="//facebook.com">
              <i className="fa fa-facebook" />
            </a>
          </li>
          <li>
            <a href="//dribbble.com">
              <i className="fa fa-dribbble" />
            </a>
          </li>
          <li>
            <a href="//pinterest.com">
              <i className="fa fa-pinterest-p" />
            </a>
          </li>
          <li>
            <a href="//twitter.com">
              <i className="fa fa-twitter" />
            </a>
          </li>
          <li>
            <a href="//linkedin.com">
              <i className="fa fa-linkedin" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

ProductDescriptionInfo.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  addToast: PropTypes.func,
  cartItems: PropTypes.array,
  compareItem: PropTypes.object,
  currency: PropTypes.object,
  discountedPrice: PropTypes.number,
  finalDiscountedPrice: PropTypes.number,
  finalProductPrice: PropTypes.number,
  product: PropTypes.object,
  wishlistItem: PropTypes.object,
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (
      item,
      addToast,
      quantityCount,
      selectedProductColor,
      selectedProductSize
    ) => {
      dispatch(
        addToCart(
          item,
          addToast,
          quantityCount,
          selectedProductColor,
          selectedProductSize
        )
      );
    },
    addToWishlist: (item, addToast) => {
      dispatch(addToWishlist(item, addToast));
    },
    addToCompare: (item, addToast) => {
      dispatch(addToCompare(item, addToast));
    },
  };
};

export default connect(null, mapDispatchToProps)(ProductDescriptionInfo);
