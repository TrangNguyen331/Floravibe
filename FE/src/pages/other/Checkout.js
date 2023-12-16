import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import MetaTags from "react-meta-tags";
import { connect, useSelector, useDispatch } from "react-redux";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
// import { getDiscountPrice } from "../../helpers/product";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import axiosInstance from "../../axiosInstance";
import { useToasts } from "react-toast-notifications";
import { deleteAllFromCart } from "../../redux/actions/cartActions";

const Checkout = ({ location, cartItems, currency }) => {
  const { pathname } = location;
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const [submitData, setSubmitData] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    streetAddress: "",
    phone: "",
    email: "",
    additionalInformation: "",
  });
  let cartTotalPrice = 0;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSubmitData({
      ...submitData,
      [name]: value,
    });
  };

  const placeOrder = () => {
    const totalValue = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const body = {
      details: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
      additionalOrder: {
        email: submitData.email,
        phone: submitData.phone,
        firstName: submitData.firstName,
        lastName: submitData.lastName,
        fullName: submitData.fullName,
        address: submitData.streetAddress,
        additionalInformation: submitData.additionalInformation,
      },
      total: totalValue,
      status: "IN_REQUEST",
      methodPaid: "CASH",
      paid: false,
    };
    try {
      axiosInstance.post("/api/v1/orders", body);
      addToast("Order success", { appearance: "success", autoDismiss: true });
      dispatch(deleteAllFromCart(addToast));
      history.push(process.env.PUBLIC_URL + "/order-thankyou");
    } catch (error) {
      addToast("Fail to create Order. Please try again later!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  useEffect(() => {
    const setDataInit = async () => {
      if (token) {
        const response = await axiosInstance.get("/api/v1/auth/identity");
        setSubmitData({
          ...submitData,
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          fullName: response.data.fullName || "",
          streetAddress: response.data.address || "",
          phone: response.data.phone || "",
          email: response.data.email || "",
        });
      }
    };
    setDataInit();
  }, []);

  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };
  return (
    <Fragment>
      <MetaTags>
        <title>Checkout</title>
        <meta name="Checkout" content="Checkout" />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Checkout
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="container mt-5">
          <ul className="progressbar">
            <li className="active">Shopping Cart</li>
            <li className="active">Checkout</li>
            <li>Order Complete</li>
          </ul>
        </div>
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {/* {cartItems && cartItems.length >= 1 ? ( */}
            <div className="row">
              <div className="col-lg-7">
                <div className="billing-info-wrap">
                  <h3>Billing Details</h3>
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="billing-info mb-20">
                        <label>First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={submitData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="billing-info mb-20">
                        <label>Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={submitData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="billing-info mb-20">
                        <label>Full Name</label>
                        <input
                          className="billing-address"
                          type="text"
                          name="fullName"
                          value={submitData.fullName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="billing-info mb-20">
                        <label>Street Address</label>
                        <input
                          className="billing-address"
                          placeholder="House number and street name"
                          type="text"
                          name="streetAddress"
                          value={submitData.streetAddress}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="billing-info mb-20">
                        <label>Phone</label>
                        <input
                          type="text"
                          name="phone"
                          value={submitData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="billing-info mb-20">
                        <label>Email Address</label>
                        <input
                          type="text"
                          name="email"
                          value={submitData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="additional-info-wrap">
                    <h4>Additional information</h4>
                    <div className="additional-info">
                      <label>Order notes</label>
                      <textarea
                        placeholder="Notes about your order, e.g. special notes for delivery. "
                        name="additionalInformation"
                        value={submitData.additionalInformation}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="your-order-area">
                  <h3>Your order</h3>
                  <div className="your-order-wrap gray-bg-4">
                    <div className="your-order-product-info">
                      <div className="your-order-top">
                        <ul>
                          <li>Product</li>
                          <li>Total</li>
                        </ul>
                      </div>
                      <div className="your-order-middle">
                        <ul>
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
                            //     finalDiscountedPrice * cartItem.quantity)
                            cartTotalPrice +=
                              finalProductPrice * cartItem.quantity;
                            return (
                              <li key={key}>
                                <span className="order-middle-left">
                                  {cartItem.name} X {cartItem.quantity}
                                </span>{" "}
                                <span className="order-price">
                                  {/* {discountedPrice !== null
                                      ? currency.currencySymbol +
                                      (
                                        finalDiscountedPrice *
                                        cartItem.quantity
                                      ).toFixed(2)
                                      :  */}
                                  {(
                                    finalProductPrice * cartItem.quantity
                                  ).toLocaleString("vi-VN") +
                                    currency.currencySymbol}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div className="your-order-bottom">
                        <ul>
                          <li className="your-order-shipping">Shipping</li>
                          <li>Free</li>
                        </ul>
                      </div>
                      <div className="your-order-total">
                        <ul>
                          <li className="order-total">Total</li>
                          <li>
                            {cartTotalPrice.toLocaleString("vi-VN") +
                              currency.currencySymbol}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="payment-method">
                      <div>
                        <input
                          type="radio"
                          value="CASH"
                          checked={paymentMethod === "CASH"}
                          onChange={handlePaymentMethodChange}
                          className="radio-input"
                        />
                        <span>Cash</span>
                      </div>
                      {/* <div>
                        <input
                          type="radio"
                          value="VNPAY"
                          checked={paymentMethod === "VNPAY"}
                          onChange={handlePaymentMethodChange}
                          className="radio-input"
                        />
                        <span>VNPay</span>
                      </div> */}
                    </div>
                  </div>
                  <div className="place-order mt-25">
                    <button className="btn-hover" onClick={() => placeOrder()}>
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="row">
              <div className="col-lg-12">
                <div className="item-empty-area text-center">
                  <div className="item-empty-area__icon mb-30">
                    <i className="pe-7s-cash"></i>
                  </div>
                  <div className="item-empty-area__text">
                    No items found in cart to checkout <br />
                    <Link to={process.env.PUBLIC_URL + "/shop"}>Shop Now</Link>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

Checkout.propTypes = {
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

export default connect(mapStateToProps)(Checkout);
