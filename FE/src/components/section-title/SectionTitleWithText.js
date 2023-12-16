import PropTypes from "prop-types";
import React from "react";

const SectionTitleWithText = ({ spaceTopClass, spaceBottomClass }) => {
  return (
    <div
      className={`welcome-area ${spaceTopClass ? spaceTopClass : ""} ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <div className="container">
        <div className="welcome-content text-center">
          <h5>Who Are We</h5>
          <h1>Welcome To Floravibe</h1>
          <p>
            Our curated collection promises fresh, vibrant arrangements for
            every occasion. Whether you're celebrating or expressing love, find
            the perfect bouquet crafted with care. We're not just a flower shop;
            we're your destination for creating memorable moments through the
            language of flowers. Thank you for choosing Floravibe – where beauty
            blooms!
          </p>
        </div>
      </div>
    </div>
  );
};

SectionTitleWithText.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
};

export default SectionTitleWithText;
