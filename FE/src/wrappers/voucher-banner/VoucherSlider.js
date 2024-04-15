import PropTypes from "prop-types";
import React from "react";
import Swiper from "react-id-swiper";
import BannerVoucher from "./BannerVoucher";

const VoucherSlider = ({ spaceBottomClass }) => {
  const settings = {
    loop: false,
    slidesPerView: 2,
    // breakpoints: {
    //   1024: {
    //     slidesPerView: 4,
    //   },
    //   768: {
    //     slidesPerView: 3,
    //   },
    //   640: {
    //     slidesPerView: 2,
    //   },
    //   320: {
    //     slidesPerView: 1,
    //   },
    // },
  };

  return (
    <div className={`${spaceBottomClass ? spaceBottomClass : ""}`}>
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
};

export default VoucherSlider;
