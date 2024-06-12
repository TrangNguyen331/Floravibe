import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import Swiper from "react-id-swiper";
import axiosInstance from "../../axiosInstance";
import BannerVoucher from "./BannerVoucher";
import "../../assets/scss/_banner-voucher.scss";
import SectionTitle from "../../components/section-title/SectionTitle";
const VoucherSlider = ({ spaceBottomClass, bgColorClass }) => {
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
          titleText="Shop Vouchers"
          positionClass="text-center"
          spaceClass="mb-30"
        />
        <div className="tagline">Applies to all invoices in the shop</div>
        <div className="row">
          <Swiper {...params}>
            {vouchers
              .filter((voucher) => voucher.isActive)
              .map((voucher) => (
                <div key={voucher.id}>
                  <BannerVoucher data={voucher} />
                </div>
              ))}
          </Swiper>
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
