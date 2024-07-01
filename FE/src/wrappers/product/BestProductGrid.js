import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axiosInstance from "../../axiosInstance";
import SectionTitle from "../../components/section-title/SectionTitle";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import ProductGridSingle from "../../components/product/ProductGridSingle";
import { addToCart } from "../../redux/actions/cartActions";
import { addToWishlist } from "../../redux/actions/wishlistActions";
const BestProductGrid = ({
  addToCart,
  addToWishlist,
  cartItems,
  wishlistItems,
  sliderClassName,
  spaceBottomClass,
  spaceTopClass,
  bgColorClass,
  dispatch,
}) => {
  const { t } = useTranslation(["home"]);
  const [bestProducts, setBestProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/v1/productStats/bestSeller`
        );
        setBestProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div
      className={`product-area ${spaceTopClass ? spaceTopClass : ""} ${
        spaceBottomClass ? spaceBottomClass : ""
      } ${bgColorClass ? bgColorClass : ""}`}
    >
      <div className="container">
        <SectionTitle
          titleText={t("best-seller")}
          positionClass="text-center"
        />
        <div className="row pt-50">
          {bestProducts &&
            bestProducts
              .sort((a, b) => b.totalQuantitySold - a.totalQuantitySold)
              .slice(0, 8)
              .map((item) => {
                return (
                  <ProductGridSingle
                    sliderClassName={sliderClassName}
                    spaceBottomClass={spaceBottomClass}
                    product={item.product}
                    addToCart={addToCart}
                    addToWishlist={addToWishlist}
                    cartItem={
                      cartItems.filter(
                        (cartItem) => cartItem.id === item.productId
                      )[0]
                    }
                    wishlistItem={
                      wishlistItems.filter(
                        (wishlistItem) => wishlistItem.id === item.productId
                      )[0]
                    }
                    key={item.productId}
                  />
                );
              })}
        </div>
      </div>
    </div>
  );
};
BestProductGrid.propTypes = {
  addToCart: PropTypes.func,
  addToWishlist: PropTypes.func,
  cartItems: PropTypes.array,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  wishlistItems: PropTypes.array,
};
const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
  };
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
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BestProductGrid);
