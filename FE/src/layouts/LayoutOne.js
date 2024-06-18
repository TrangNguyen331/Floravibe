import PropTypes from "prop-types";
import React, { Fragment } from "react";
import HeaderOne from "../wrappers/header/HeaderOne";
import FooterOne from "../wrappers/footer/FooterOne";

const LayoutOne = ({ children, headerTop }) => {
  return (
    <Fragment>
      <HeaderOne top={headerTop} />
      {children}
      <FooterOne
        backgroundColorClass="bg-gray"
        spaceTopClass="pt-100"
        spaceBottomClass="pb-70"
      />
    </Fragment>
  );
};

LayoutOne.propTypes = {
  children: PropTypes.any,
  // headerContainerClass: PropTypes.string,
  // headerPaddingClass: PropTypes.string,
  // headerPositionClass: PropTypes.string,
};

export default LayoutOne;
