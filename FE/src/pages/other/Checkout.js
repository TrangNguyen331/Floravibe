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
import dayjs from "dayjs";

const Checkout = ({ location, cartItems, currency }) => {
  const { pathname } = location;
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const { t } = useTranslation(["checkout", "myacc", "orders", "breadcrumb"]);
  const [cities, setCities] = useState([]);

  const [disableOption1, setDisableOption1] = useState(false);
  const [disableOption2, setDisableOption2] = useState(false);

  const [orders, setOrders] = useState([]);

  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
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
    deliveryDate: "",
    deliveryTime: "",
  });
  let cartTotalPrice = 0;

  const [appliedVoucherName, setAppliedVoucherName] = useState("");
  const [vouchers, setVouchers] = useState([]);

  const getVouchers = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/vouchers");
      setVouchers(response.data);
    } catch (error) {
      console.log(t("notice.load-data"), error);
    }
  };
  useEffect(() => {
    getVouchers();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "deliveryDate") {
      setSubmitData({
        ...submitData,
        [name]: value,
        deliveryTime: "", // Reset deliveryTime to default or null
      });
    } else {
      setSubmitData({
        ...submitData,
        [name]: value,
      });
    }
    // Kiểm tra nếu ngày được chọn là ngày hiện tại
    if (name === "deliveryDate" && dayjs(value).isSame(dayjs(), "day")) {
      const currentTime = dayjs().add(2, "hour");

      const startTime1 = dayjs().set("hour", 7).set("minute", 0);
      const endTime1 = dayjs().set("hour", 12).set("minute", 0);

      const startTime2 = dayjs().set("hour", 13).set("minute", 0);
      const endTime2 = dayjs().set("hour", 21).set("minute", 0);

      if (currentTime.isAfter(startTime1) && currentTime.isBefore(endTime1)) {
        setDisableOption1(false);
        setDisableOption2(false);
      } else if (
        currentTime.isAfter(startTime2) &&
        currentTime.isBefore(endTime2)
      ) {
        setDisableOption1(true);
        setDisableOption2(false);
      } else {
        setDisableOption1(true);
        setDisableOption2(true);
      }
    } else {
      setDisableOption1(false);
      setDisableOption2(false);
    }
  };
  const applyCoupon = () => {
    setIsLoading(true);
    if (!submitData.voucherName) {
      setIsLoading(false);
      addToast(t("notice.enter-valid-voucher"), {
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
          addToast(t("notice.out-of-stocket-voucher"), {
            appearance: "error",
            autoDismiss: true,
          });
        }
      } else {
        setIsLoading(false);
        addToast(t("notice.invalid-voucher"), {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } else {
      setIsLoading(false);
      addToast(t("notice.invalid-voucher-code"), {
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
        deliveryDate: new Date(submitData.deliveryDate),
        deliveryTime: submitData.deliveryTime,
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
        addToast(t("notice.fail-create-order"), {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } else {
      addToast(t("notice.must-login"), {
        appearance: "warning",
        autoDismiss: true,
      });
    }
  };
  const clickPlaceOrder = async () => {
    if (
      submitData.firstName === "" ||
      submitData.lastName === "" ||
      submitData.ward === "" ||
      submitData.district === "" ||
      submitData.city === "" ||
      submitData.houseNumber === "" ||
      submitData.phone === "" ||
      submitData.email === "" ||
      submitData.deliveryDate === "" ||
      submitData.deliveryTime === ""
    ) {
      setIsError(true);
    } else {
      setIsError(false);
      await placeOrder();
    }
  };
  const getAllOrders = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/orders");
      setOrders(response.data);
    } catch (error) {
      console.log(t("notice.load-order-fail"));
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
        <title>{t("form.checkout")}</title>
        <meta name="Checkout" content="Checkout" />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {t("breadcrumb:home")}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {t("form.checkout")}
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="container mt-5">
          <ul className="progressbar">
            <li className="active">{t("form.shopping-cart")}</li>
            <li className="active">{t("form.checkout")}</li>
            <li>{t("form.order-complete")}</li>
          </ul>
        </div>
        <div className="container mt-5">
          <div className="discount-code-wrapper col-lg-6">
            <h4>{t("form.order-complete")}</h4>
            <div className="discount-code">
              <div className="row">
                <div className="col-lg-7 col-md-6">
                  <input
                    type="text"
                    name="voucherName"
                    placeholder={t("form.enter-coupon-code")}
                    value={submitData.voucherName}
                    onChange={handleInputChange}
                  />
                </div>
                <button
                  className="cart-btn-2"
                  onClick={applyCoupon}
                  disabled={isLoading}
                >
                  {isLoading ? "Applying..." : t("form.apply")}
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
                  <h3>{t("form.billing-details")}</h3>
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div
                        className={`billing-info mb-20 ${
                          isError && !submitData.firstName ? "error" : ""
                        }`}
                      >
                        <label>{t("myacc:first-name")}</label>
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
                      <div
                        className={`billing-info mb-20 ${
                          isError && !submitData.lastName ? "error" : ""
                        }`}
                      >
                        <label>{t("myacc:last-name")}</label>
                        <input
                          type="text"
                          name="lastName"
                          value={submitData.lastName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div
                        className={`billing-info mb-20 ${
                          isError && !submitData.fullName ? "error" : ""
                        }`}
                      >
                        <label>{t("myacc:full-name")}</label>
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
                        <label>{t("myacc:address")}</label>
                        <div>
                          <select
                            className="select-box form-select form-select-sm mb-3"
                            name="city"
                            value={submitData.city}
                            onChange={handleInputChange}
                            aria-label=".form-select-sm"
                          >
                            <option value="" disabled>
                              {t("myacc:city")}
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
                            onChange={handleInputChange}
                            aria-label=".form-select-sm"
                          >
                            <option value="" disabled>
                              {t("myacc:district")}
                            </option>
                            {submitData.city &&
                              cities.some(
                                (city) => city.Name === submitData.city
                              ) &&
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
                              {t("myacc:ward")}
                            </option>
                            {submitData.district &&
                              submitData.ward &&
                              cities.some(
                                (city) => city.Name === submitData.city
                              ) &&
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
                            className={`billing-address ${
                              isError && !submitData.houseNumber ? "error" : ""
                            }`}
                            placeholder={t("myacc:detail-address")}
                            type="text"
                            name="houseNumber"
                            value={submitData.houseNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div
                        className={`time-delivery mb-20 ${
                          isError && !submitData.deliveryDate ? "error" : ""
                        }`}
                      >
                        <label>{t("form.delivery-date")}</label>
                        <input
                          type="date"
                          name="deliveryDate"
                          value={submitData.deliveryDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div
                        className={`time-delivery mb-20 ${
                          isError && !submitData.deliveryTime ? "error" : ""
                        }`}
                      >
                        <label>{t("form.delivery-time")}</label>
                        <select
                          name="deliveryTime"
                          className="select-time"
                          value={submitData.deliveryTime}
                          onChange={handleInputChange}
                        >
                          <option disabled value="">
                            {t("form.select-time")}
                          </option>
                          <option
                            value="7:00 AM to 12:00 PM"
                            disabled={disableOption1}
                          >
                            07:00 AM to 12:00 PM
                          </option>
                          <option
                            value="1:00 PM to 9:00 PM"
                            disabled={disableOption2}
                          >
                            01:00 PM to 09:00 PM
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div
                        className={`billing-info mb-20 ${
                          isError && !submitData.phone ? "error" : ""
                        }`}
                      >
                        <label>{t("myacc:phone")}</label>
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
                    <h3>{t("form.add-information")}</h3>
                    <div className="additional-info">
                      <label>{t("form.order-note")}</label>
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
                  <h3>{t("form.your-order")}</h3>
                  <div className="your-order-wrap gray-bg-4">
                    <div className="your-order-product-info">
                      <div className="your-order-top">
                        <ul>
                          <li>{t("orders:detail.products")}</li>
                          <li>{t("orders:detail.total")}</li>
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
                                  ).toLocaleString("vi-VN") + "₫"}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div className="your-order-bottom">
                        <ul>
                          <li className="your-order-shipping">
                            {t("orders:detail.shipping")}
                          </li>
                          <li>{t("orders:detail.free")}</li>
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
                          <li className="order-total">
                            {t("orders:detail.total")}
                          </li>
                          <li>
                            {orders.length === 0
                              ? (
                                  cartTotalPrice -
                                  cartTotalPrice * 0.1 -
                                  voucherDiscount
                                ).toLocaleString("vi-VN") + "₫"
                              : (
                                  cartTotalPrice - voucherDiscount
                                ).toLocaleString("vi-VN") + "₫"}
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
                        <span>{t("form.cash")}</span>
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
                    <button
                      className="btn-hover"
                      onClick={() => clickPlaceOrder()}
                    >
                      {t("form.place-order")}
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
