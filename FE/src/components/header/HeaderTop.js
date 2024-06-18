import PropTypes from "prop-types";
import React from "react";
import { multilanguage } from "redux-multilanguage";
import { connect } from "react-redux";
import { setCurrency } from "../../redux/actions/currencyActions";
import LanguageCurrencyChanger from "./sub-components/LanguageCurrencyChanger";
import { useTranslation } from "react-i18next";
const HeaderTop = ({
  currency,
  setCurrency,
  currentLanguageCode,
  dispatch,
  borderStyle,
}) => {
  return (
    <div
      className={`header-top-wap ${
        borderStyle === "fluid-border" ? "border-bottom" : ""
      }`}
    >
      <div className="header-contact">
        <p>Call Us 0188468580</p>
      </div>
      <div className="header-offer">
        <p>Free delivery every order</p>
      </div>
    </div>
  );
};

HeaderTop.propTypes = {
  borderStyle: PropTypes.string,
  setCurrency: PropTypes.func,
  currency: PropTypes.object,
  currentLanguageCode: PropTypes.string,
  dispatch: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    currency: state.currencyData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrency: (currencyName) => {
      dispatch(setCurrency(currencyName));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(multilanguage(HeaderTop));
