import PropTypes from "prop-types";
import React from "react";
import { multilanguage } from "redux-multilanguage";
import { connect } from "react-redux";
import { setCurrency } from "../../redux/actions/currencyActions";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
const HeaderTop = ({ borderStyle }) => {
  const { t } = useTranslation(["header"]);
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
        <Link to={process.env.PUBLIC_URL + "/check-order"}>
          {t("check-order")}
        </Link>
        <div className="mr-2">|</div>
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
