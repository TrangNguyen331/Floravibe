import React, { Fragment } from "react";
import "../../assets/scss/_banner-voucher.scss";
import { Col, Row } from "reactstrap";
import PropTypes from "prop-types";
const BannerVoucher = ({ data, sliderClass }) => {
  const formatReadableDate = (dateValue) => {
    const date = new Date(dateValue);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="parent-background">
      <div className="child-background">
        <Row>
          <Col className="info-voucher" lg="7" md="7">
            <div className="voucher">Voucher</div>
            <div className="valid">
              <span className="number">{data.voucherValue}</span>
              <span className="currency">VND</span>
            </div>
            <div className="due-date">
              {formatReadableDate(data.effectiveDate)} -{" "}
              {formatReadableDate(data.validUntil)}
            </div>
            <div className="first-content">{data.description}</div>
          </Col>
          <Col className="info-code-voucher" lg="5" md="5">
            <div className="text-enter-code">
              <span>Enter code</span>
            </div>
            <div className="code">{data.voucherName}</div>
            <div>AT CHECKOUT</div>
            <div className="quantity">Quantity: {data.quantity}</div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
BannerVoucher.propTypes = {
  data: PropTypes.object,
  sliderClass: PropTypes.string,
};
export default BannerVoucher;
