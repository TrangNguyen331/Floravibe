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
import { useTranslation } from "react-i18next";

const Checkout = ({ location, cartItems, currency }) => {
  const { pathname } = location;
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const {t} = useTranslation(['checkout', 'myacc', 'orders', 'breadcrumb'])

  const [cities, setCities] = useState([]);

  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [date, setDate] = useState();
  console.log("Date", date);
  
  const [disableOption1, setDisableOption1] = useState(false);
  const [disableOption2, setDisableOption2] = useState(false);
  const [disableOption3, setDisableOption3] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState("");

  useEffect(() => {
  const currentDate = new Date();
  const selectedDate = new Date(date);

  if (selectedDate.toDateString() === currentDate.toDateString()) {
    const currentHour = currentDate.getHours();

    setDisableOption1(currentHour >= 12);
    setDisableOption2(currentHour >= 17);
    setDisableOption3(currentHour >= 21);
  } else {
    setDisableOption1(false);
    setDisableOption2(false);
    setDisableOption3(false);
  }
}, [date]);

  const [orders, setOrders] = useState([]);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [submitData, setSubmitData] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    ward: "",
    district: "",
    city: "",
    houseNumber: "",
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
      console.log(t('notice.load-data'), error);
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
      addToast(t('notice.enter-valid-voucher'), {
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
          }, 1300);
        } else {
          setIsLoading(false);
          addToast(t('notice.out-of-stocket-voucher'), {
            appearance: "error",
            autoDismiss: true,
          });
        }
      } else {
        setIsLoading(false);
        addToast(t('notice.invalid-voucher'), {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } else {
      setIsLoading(false);
      addToast(t('notice.invalid-voucher-code'), {
        appearance: "error",
        autoDismiss: true,
      });
    }
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

      let selectedCityName = "";
      let selectedDistrictName = "";
      let selectedWardName = "";

      if (submitData.city && submitData.district && submitData.ward) {
        const selectedCityData = cities.find(
          (city) => city.Name === submitData.city
        );
        if (selectedCityData) {
          selectedCityName = selectedCityData.Name;
          const selectedDistrictData = selectedCityData.Districts.find(
            (district) => district.Name === submitData.district
          );
          if (selectedDistrictData) {
            selectedDistrictName = selectedDistrictData.Name;
            const selectedWardData = selectedDistrictData.Wards.find(
              (ward) => ward.Name === submitData.ward
            );
            if (selectedWardData) {
              selectedWardName = selectedWardData.Name;
            }
          }
        }
      }

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
          ward: selectedWardName,
          district: selectedDistrictName,
          city: selectedCityName,
          houseNumber: submitData.houseNumber,
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
        addToast(t('notice.fail-create-order'), {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } else {
      addToast(t('notice.must-login'), {
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
      console.log(t('notice.load-order-fail'));
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
          ward: response.data.ward || "",
          district: response.data.district || "",
          city: response.data.city || "",
          houseNumber: response.data.houseNumber || "",
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
        <title>{t('form.checkout')}</title>
        <meta name="Checkout" content="Checkout" />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>{t('breadcrumb:home')}</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>{t('form.checkout')}</BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="container mt-5">
          <ul className="progressbar">
            <li className="active">{t('form.shopping-cart')}</li>
            <li className="active">{t('form.checkout')}</li>
            <li>{t('form.order-complete')}</li>
          </ul>
        </div>
        <div className="container mt-5">
          <div className="discount-code-wrapper col-lg-6">
            <h4>{t('form.order-complete')}</h4>
            <div className="discount-code">
              <div className="row">
                <div className="col-lg-7 col-md-6">
                  <input
                    type="text"
                    required
                    name="voucherName"
                    placeholder={t('form.enter-coupon-code')}
                    value={submitData.voucherName}
                    onChange={handleInputChange}
                  />
                </div>
                <button
                  className="cart-btn-2"
                  onClick={applyCoupon}
                  disabled={isLoading}
                >
                  {isLoading ? "Applying..." : t('form.apply')}
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
                  <h3>{t('form.billing-details')}</h3>
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="billing-info mb-20">
                        <label>{t('myacc:first-name')}</label>
                        <input
                          required
                          type="text"
                          name="firstName"
                          value={submitData.firstName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="billing-info mb-20">
                        <label>{t('myacc:last-name')}</label>
                        <input
                          required
                          type="text"
                          name="lastName"
                          value={submitData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="billing-info mb-20">
                        <label>{t('myacc:full-name')}</label>
                        <input
                          required
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
                        <label>{t('myacc:address')}</label>
                        <div>
                          <select
                            className="select-box form-select form-select-sm mb-3"
                            name="city"
                            value={submitData.city}
                            onChange={handleInputChange}
                            aria-label=".form-select-sm"
                          >
                            <option value="" disabled>
                              {t('myacc:city')}
                            </option>
                            {cities.map((city) => (
                              <option key={city.Id} value={city.Name}>
                                {city.Name}
                              </option>
                            ))}
                          </select>

                          <select
                            className="select-box form-select form-select-sm mb-3"
                            name="district"
                            value={submitData.district}
                            // onChange={(e) => {
                            //   handleInputChange
                            //   setSelectedWard(""); // Xóa lựa chọn của phường/xã khi chọn lại quận/huyện
                            // }}
                            onChange={handleInputChange}
                            aria-label=".form-select-sm"
                          >
                            <option value="" disabled>
                              {t('myacc:district')}
                            </option>
                            {submitData.city &&
                              cities
                                .find((city) => city.Name === submitData.city)
                                .Districts.map((district) => (
                                  <option
                                    key={district.Id}
                                    value={district.Name}
                                  >
                                    {district.Name}
                                  </option>
                                ))}
                          </select>

                          <select
                            className="select-box form-select form-select-sm"
                            name="ward"
                            value={submitData.ward}
                            onChange={handleInputChange}
                            aria-label=".form-select-sm"
                          >
                            <option value="" disabled>
                              {t('myacc:ward')}
                            </option>
                            {submitData.district &&
                              cities
                                .find((city) => city.Name === submitData.city)
                                .Districts.find(
                                  (district) =>
                                    district.Name === submitData.district
                                )
                                .Wards.map((ward) => (
                                  <option key={ward.Id} value={ward.Name}>
                                    {ward.Name}
                                  </option>
                                ))}
                          </select>
                          <input
                            required
                            className="billing-address"
                            placeholder={t('myacc:detail-address')}
                            type="text"
                            name="houseNumber"
                            value={submitData.houseNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="time-delivery mb-20">
                        <label>{t('form.delivery-date')}</label>
                        <input type="date" onChange={ e=> { setDate(e.target.value); setDeliveryTime(""); }}></input>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="time-delivery mb-20">
                        <label>{t('form.delivery-time')}</label>
                        <select className="select-time" value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)}>
                          <option value="" disabled hidden>{t('form.select-time')}</option>
                          <option value="10:00 AM to 12:00 PM" disabled={disableOption1}>10:00 AM to 12:00 PM</option>
                          <option value="2:00 PM to 5:00 PM" disabled={disableOption2}>2:00 PM to 5:00 PM</option>
                          <option value="7:00 PM to 9:00 PM" disabled={disableOption3}>7:00 PM to 9:00 PM</option>
                        </select>
                      </div>                      
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="billing-info mb-20">
                        <label>{t('myacc:phone')}</label>
                        <input
                          required
                          type="text"
                          name="phone"
                          value={submitData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="billing-info mb-20">
                        <label>Email</label>
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
                    <h3>{t('form.add-information')}</h3>
                    <div className="additional-info">
                      <label>{t('form.order-note')}</label>
                      <textarea
                        placeholder="Notes about your order, e.g. special notes for delivery."
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
                  <h3>{t('form.your-order')}</h3>
                  <div className="your-order-wrap gray-bg-4">
                    <div className="your-order-product-info">
                      <div className="your-order-top">
                        <ul>
                          <li>{t('orders:detail.products')}</li>
                          <li>{t('orders:detail.total')}</li>
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
                                    "₫"}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div className="your-order-bottom">
                        <ul>
                          <li className="your-order-shipping">{t('orders:detail.shipping')}</li>
                          <li>{t('orders:detail.free')}</li>
                        </ul>
                        {orders.length === 0 && (
                          <ul className="mt-3">
                            <li className="your-order-shipping">First order</li>
                            <li>
                              {"-" +
                                (cartTotalPrice * 0.1).toLocaleString("vi-VN") +
                                "₫"}
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
                                "₫"}
                            </li>
                          </ul>
                        )}
                      </div>
                      <div className="your-order-total">
                        <ul>
                          <li className="order-total">{t('orders:detail.total')}</li>
                          <li>
                            {orders.length === 0
                              ? (
                                  cartTotalPrice -
                                  cartTotalPrice * 0.1 -
                                  voucherDiscount
                                ).toLocaleString("vi-VN") +
                                "₫"
                              : (
                                  cartTotalPrice - voucherDiscount
                                ).toLocaleString("vi-VN") +
                                "₫"}
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
                        <span>{t('form.cash')}</span>
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
                      {t('form.place-order')}
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
