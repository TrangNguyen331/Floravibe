import PropTypes from "prop-types";
import React, { Fragment } from "react";
import HeaderOne from "../wrappers/header/HeaderOne";
import FooterOne from "../wrappers/footer/FooterOne";

const LayoutOne = ({
  children,
  // headerContainerClass,
  // headerPaddingClass,
  // headerPositionClass,
}) => {
  return (
    <Fragment>
      <HeaderOne
      // layout={headerContainerClass}
      // headerPaddingClass={headerPaddingClass}
      // headerPositionClass={headerPositionClass}
      />
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
