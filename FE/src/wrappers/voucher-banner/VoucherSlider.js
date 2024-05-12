import PropTypes from "prop-types";
import React from "react";
import Swiper from "react-id-swiper";
import BannerVoucher from "./BannerVoucher";

const VoucherSlider = ({ spaceBottomClass, bgColorClass }) => {
  const settings = {
    loop: false,
    slidesPerView: 2,
  };

  return (
    <div
      className={`${spaceBottomClass ? spaceBottomClass : ""} ${
        bgColorClass ? bgColorClass : ""
      }`}
    >
      <div className="container">
        {/* <SectionTitle
          titleText="Related Products"
          positionClass="text-center"
          spaceClass="mb-50"
        /> */}
        <div className="row">
          <Swiper {...settings}>
            <BannerVoucher sliderClassName="swiper-slide" />
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
