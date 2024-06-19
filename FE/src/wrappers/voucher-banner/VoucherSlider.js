import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import Swiper from "react-id-swiper";
import axiosInstance from "../../axiosInstance";
import BannerVoucher from "./BannerVoucher";
import "../../assets/scss/_banner-voucher.scss";
import SectionTitle from "../../components/section-title/SectionTitle";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
const VoucherSlider = ({ spaceBottomClass, bgColorClass }) => {
  const { t } = useTranslation(["home"]);
  const [vouchers, setVouchers] = useState([]);
  const token = useSelector((state) => state.auth.token);
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

  const params = {
    slidesPerView: 3,
    spaceBetween: 10,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    observer: true,
    observeParents: true,
  };
  const targetList = token
    ? vouchers.filter((voucher) => voucher.isActive && !voucher.guest)
    : vouchers.filter((voucher) => voucher.isActive && voucher.guest);

  return !vouchers ? (
    ""
  ) : (
    <div
      className={`voucherslider-area ${
        spaceBottomClass ? spaceBottomClass : ""
      } ${bgColorClass ? bgColorClass : ""}`}
    >
      <div className="container">
        <SectionTitle
          titleText={t("bannervoucher.shop-vouchers")}
          positionClass="text-center"
          spaceClass="mb-30"
        />
        <div className="tagline">{t("bannervoucher.tagline")}</div>

        <div className="row">
          {targetList.length < 3 ? (
            <div className="guest-voucher">
              {targetList.map((voucher) => (
                <div key={voucher.id}>
                  <BannerVoucher data={voucher} />
                </div>
              ))}
            </div>
          ) : (
            <Swiper {...params}>
              {targetList.map((voucher) => (
                <div key={voucher.id}>
                  <BannerVoucher data={voucher} />
                </div>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

VoucherSlider.propTypes = {
  spaceBottomClass: PropTypes.string,
  bgColorClass: PropTypes.string,
};

export default VoucherSlider;
