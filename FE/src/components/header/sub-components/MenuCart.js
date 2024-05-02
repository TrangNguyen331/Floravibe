import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
// import { getDiscountPrice } from "../../../helpers/product";

const MenuCart = ({ cartData, currency, deleteFromCart }) => {
  let cartTotalPrice = 0;
  const { addToast } = useToasts();
  const {t} = useTranslation(['orders'])
  return (
    <div className="shopping-cart-content">
      {
        cartData && cartData.length > 0 ? (
          <Fragment>
            <ul>
              {cartData.map((single, key) => {
                // const discountedPrice = getDiscountPrice(
                //   single.price,
                //   single.discount
                // );
                const finalProductPrice = single.price * currency.currencyRate;
                // const finalDiscountedPrice = (
                //   discountedPrice * currency.currencyRate
                // ).toFixed(2);

                // discountedPrice != null
                //   ? (cartTotalPrice += finalDiscountedPrice * single.quantity):
                cartTotalPrice += finalProductPrice * single.quantity;

                return (
                  <li className="single-shopping-cart" key={key}>
                    <div className="shopping-cart-img">
                      <Link
                        to={process.env.PUBLIC_URL + "/product/" + single.id}
                      >
                        <img
                          alt=""
                          src={single.images[0]}
                          className="img-fluid"
                        />
                      </Link>
                    </div>
                    <div className="shopping-cart-title">
                      <h4>
                        <Link
                          to={process.env.PUBLIC_URL + "/product/" + single.id}
                        >
                          {single.name}
                        </Link>
                      </h4>
                      <h6>{t('detail.qty')}: {single.quantity}</h6>
                      <span>
                        {/* {discountedPrice !== null
                        ? finalDiscountedPrice + " " + currency.currencySymbol */}
                        {finalProductPrice.toLocaleString("vi-VN") +
                          "₫"}
                      </span>
                      {single.selectedProductColor &&
                      single.selectedProductSize ? (
                        <div className="cart-item-variation">
                          <span>Color: {single.selectedProductColor}</span>
                          <span>Size: {single.selectedProductSize}</span>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="shopping-cart-delete">
                      <button onClick={() => deleteFromCart(single, addToast)}>
                        <i className="fa fa-times-circle" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="shopping-cart-total">
              <h4>
                {t('detail.total')}
                <span className="shop-total">
                  {cartTotalPrice.toLocaleString("vi-VN") +
                    "₫"}
                </span>
              </h4>
            </div>
            <div className="shopping-cart-btn btn-hover text-center">
              <Link
                className="default-btn"
                to={process.env.PUBLIC_URL + "/cart"}
              >
                {t('cart.view-cart')}
              </Link>
              <Link
                className="default-btn"
                to={process.env.PUBLIC_URL + "/checkout"}
              >
                {t('complete.checkout')}
              </Link>
            </div>
          </Fragment>
        ) : null
        // <p className="text-center">No items added to cart</p>
      }
    </div>
  );
};

MenuCart.propTypes = {
  cartData: PropTypes.array,
  currency: PropTypes.object,
  deleteFromCart: PropTypes.func,
};

export default MenuCart;
