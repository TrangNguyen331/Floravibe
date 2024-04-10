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
import axios from "axios";

const Checkout = ({ location, cartItems, currency }) => {
  const { pathname } = location;
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [orders, setOrders] = useState([]);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [submitData, setSubmitData] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    streetAddress: "",
    phone: "",
    email: "",
    additionalInformation: "",
    voucherName: "",
  });
  let cartTotalPrice = 0;

  const [appliedVoucherName, setAppliedVoucherName] = useState("");
  const [vouchers, setVouchers] = useState([]);

  const getVouchers = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/vouchers");
      setVouchers(response.data);
    } catch (error) {
      console.log("Fetch data error", error);
    }
  };
  useEffect(() => {
    getVouchers();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSubmitData({
      ...submitData,
      [name]: value,
    });
  };
  const applyCoupon = () => {
    setIsLoading(true);
    if (!submitData.voucherName) {
      setIsLoading(false);
      addToast("Please enter a valid voucher code!", {
        appearance: "error",
        autoDismiss: true,
      });
      return;
    }
    const selectedVoucher = vouchers
      .filter((voucher) => voucher.isActive === true)
      .find((voucher) => voucher.voucherName === submitData.voucherName);

    if (selectedVoucher) {
      const currentDate = new Date();
      const effectiveDate = new Date(selectedVoucher.effectiveDate);
      const validUntil = new Date(selectedVoucher.validUntil);
      // Kiểm tra xem ngày hiện tại có nằm trong khoảng từ effectiveDate đến validUntil không
      if (currentDate >= effectiveDate && currentDate <= validUntil) {
        if (selectedVoucher.quantity > 0) {
          setTimeout(() => {
            setVoucherDiscount(selectedVoucher.voucherValue);
            setAppliedVoucherName(submitData.voucherName);
            setSubmitData({ ...submitData, voucherName: "" });
            setIsLoading(false);
            console.log("applied");
          }, 1300);
        } else {
          setIsLoading(false);
          addToast("This voucher is out of stock!", {
            appearance: "error",
            autoDismiss: true,
          });
        }
      } else {
        setIsLoading(false);
        addToast("This voucher is not currently valid!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } else {
      setIsLoading(false);
      addToast("Invalid voucher code!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    console.log("selectedVoucher", selectedVoucher);
  };

  const placeOrder = async () => {
    if (token) {
      const totalValue = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      const firstDiscount = totalValue * 0.1;
      const selectedVoucher = vouchers
        .filter((voucher) => voucher.isActive === true)
        .find((voucher) => voucher.voucherName === appliedVoucherName);

      const voucherDiscount = selectedVoucher
        ? selectedVoucher.voucherValue
        : 0;

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
        voucherDetail: selectedVoucher
          ? {
              id: selectedVoucher.id,
              voucherName: appliedVoucherName,
              voucherValue: selectedVoucher.voucherValue,
              description: selectedVoucher.description,
              effectiveDate: selectedVoucher.effectiveDate,
              validUntil: selectedVoucher.validUntil,
              quantity: selectedVoucher.quantity,
              usedVoucher: selectedVoucher.usedVoucher,
            }
          : {
              id: null,
              voucherName: "",
              voucherValue: 0,
              description: "",
              effectiveDate: "",
              validUntil: "",
              quantity: 0,
              usedVoucher: 0,
            },

        total:
          orders.length === 0
            ? totalValue - firstDiscount - voucherDiscount
            : totalValue - voucherDiscount,
        status: "IN_REQUEST",
        methodPaid: "CASH",
        paid: false,
      };

      try {
        await axiosInstance.post("/api/v1/orders", body);

        if (selectedVoucher) {
          const quantity =
            selectedVoucher.quantity === 0 ? 0 : selectedVoucher.quantity - 1;
          const usedVoucher = selectedVoucher.usedVoucher + 1;
          let voucherBody = {
            voucherName: selectedVoucher.voucherName,
            voucherValue: selectedVoucher.voucherValue,
            description: selectedVoucher.description,
            effectiveDate: selectedVoucher.effectiveDate,
            validUntil: selectedVoucher.validUntil,
            quantity: quantity,
            usedVoucher: usedVoucher,
          };

          await axiosInstance.put(
            "/api/v1/vouchers/" + selectedVoucher.id,
            voucherBody
          );
        }

        addToast("Order success", {
          appearance: "success",
          autoDismiss: true,
        });
        getAllOrders();
        dispatch(deleteAllFromCart(addToast));
        history.push(process.env.PUBLIC_URL + "/order-thankyou");
      } catch (error) {
        addToast("Fail to create Order. Please try again later!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } else {
      addToast("Please login to place order!", {
        appearance: "warning",
        autoDismiss: true,
      });
    }
  };

  const getAllOrders = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/orders");
      setOrders(response.data);
      console.log("orders", orders);
    } catch (error) {
      console.log("Fail to load my orders");
    }
  };
  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
      )
      .then((response) => {
        const hcmCity = response.data.filter(
          (city) => city.Name === "Thành phố Hồ Chí Minh"
        );
        setCities(hcmCity);
      })
      .catch((error) => console.error(error));
  }, []);
  useEffect(() => {
    if (selectedCity && selectedDistrict && selectedWard) {
      const selectedCityName = cities.find(
        (city) => city.Id === selectedCity
      ).Name;
      const selectedDistrictName = cities
        .find((city) => city.Id === selectedCity)
        .Districts.find((district) => district.Id === selectedDistrict).Name;
      const selectedWardName = cities
        .find((city) => city.Id === selectedCity)
        .Districts.find((district) => district.Id === selectedDistrict)
        .Wards.find((ward) => ward.Id === selectedWard).Name;
      setSubmitData({
        ...submitData,
        streetAddress: `${selectedWardName}, ${selectedDistrictName}, ${selectedCityName}`,
      });
    }
  }, [selectedCity, selectedDistrict, selectedWard]);

  useEffect(() => {
    if (token) {
      getAllOrders();
    }
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
        <div className="container mt-5">
          <div className="discount-code-wrapper col-lg-6">
            <h4>Use Coupon Code</h4>
            <div className="discount-code">
              <div className="row">
                <div className="col-lg-7 col-md-6">
                  <input
                    type="text"
                    required
                    name="voucherName"
                    placeholder="Enter coupon code"
                    value={submitData.voucherName}
                    onChange={handleInputChange}
                  />
                </div>
                <button
                  className="cart-btn-2"
                  onClick={applyCoupon}
                  disabled={isLoading}
                >
                  {isLoading ? "Applying..." : "Apply Coupon"}
                </button>
              </div>
            </div>
          </div>
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
                        <label>Address</label>
                        <div>
                          <select
                            className="select-box form-select form-select-sm mb-3"
                            id="city"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            aria-label=".form-select-sm"
                          >
                            <option value="" disabled>
                              Choose Province/City
                            </option>
                            {cities.map((city) => (
                              <option key={city.Id} value={city.Id}>
                                {city.Name}
                              </option>
                            ))}
                          </select>

                          <select
                            className="select-box form-select form-select-sm mb-3"
                            id="district"
                            value={selectedDistrict}
                            onChange={(e) => {
                              setSelectedDistrict(e.target.value);
                              setSelectedWard(""); // Xóa lựa chọn của phường/xã khi chọn lại quận/huyện
                            }}
                            aria-label=".form-select-sm"
                          >
                            <option value="" disabled>
                              Choose District
                            </option>
                            {selectedCity &&
                              cities
                                .find((city) => city.Id === selectedCity)
                                .Districts.map((district) => (
                                  <option key={district.Id} value={district.Id}>
                                    {district.Name}
                                  </option>
                                ))}
                          </select>

                          <select
                            className="select-box form-select form-select-sm"
                            id="ward"
                            value={selectedWard}
                            onChange={(e) => setSelectedWard(e.target.value)}
                            aria-label=".form-select-sm"
                          >
                            <option value="" disabled>
                              Choose Ward
                            </option>
                            {selectedDistrict &&
                              cities
                                .find((city) => city.Id === selectedCity)
                                .Districts.find(
                                  (district) => district.Id === selectedDistrict
                                )
                                .Wards.map((ward) => (
                                  <option key={ward.Id} value={ward.Id}>
                                    {ward.Name}
                                  </option>
                                ))}
                          </select>
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
                          disabled
                          name="email"
                          value={submitData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="additional-info-wrap">
                    <h3>Additional information</h3>
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
              {/* Order info */}
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
                        {orders.length === 0 && (
                          <ul className="mt-3">
                            <li className="your-order-shipping">First order</li>
                            <li>
                              {"-" +
                                (cartTotalPrice * 0.1).toLocaleString("vi-VN") +
                                currency.currencySymbol}
                            </li>
                          </ul>
                        )}
                        {voucherDiscount > 0 && (
                          <ul className="mt-3">
                            <li className="your-order-shipping">
                              {appliedVoucherName && appliedVoucherName}
                            </li>
                            <li>
                              {"-" +
                                voucherDiscount.toLocaleString("vi-VN") +
                                currency.currencySymbol}
                            </li>
                          </ul>
                        )}
                      </div>
                      <div className="your-order-total">
                        <ul>
                          <li className="order-total">Total</li>
                          <li>
                            {orders.length === 0
                              ? (
                                  cartTotalPrice -
                                  cartTotalPrice * 0.1 -
                                  voucherDiscount
                                ).toLocaleString("vi-VN") +
                                currency.currencySymbol
                              : (
                                  cartTotalPrice - voucherDiscount
                                ).toLocaleString("vi-VN") +
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
