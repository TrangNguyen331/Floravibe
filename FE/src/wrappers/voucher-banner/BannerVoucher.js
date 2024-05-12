import React, { Fragment, useEffect, useState } from "react";
import "../../assets/scss/_banner-voucher.scss";
import { Col, Row } from "reactstrap";
import axiosInstance from "../../axiosInstance";

const BannerVoucher = () => {
  //const backgroundImgUrl = 'https://lh3.googleusercontent.com/drive-viewer/AKGpihYZDAu8ksjURC5Md6OlUYUsP2-8KLDizCjW8DvDcsoprD6vOsTZdyWJlFGr6oT1ii5AIdFMc8OD5DKlBg2ytrVGEVGtVlQ2oCM=s1600-rw-v1'
  const [vouchers, setVouchers] = useState([]);

  const getVouchers = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/vouchers");
      setVouchers(response.data);
    } catch (error) {
      console.log("Fetch data error", error);
    }
  };
  const formatReadableDate = (dateValue) => {
    const date = new Date(dateValue);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    getVouchers();
  }, []);
  return (
    <Fragment>
      {vouchers
        .filter((voucher) => voucher.isActive)
        .map((voucher, index) => {
          return (
            <Col lg="5" md="5" style={{ width: "1195px" }} key={index}>
              <div className="parent-background">
                <div className="child-background">
                  <Row>
                    <Col className="info-voucher" lg="7" md="7">
                      <div className="voucher">Voucher</div>
                      <div className="valid">
                        <span className="number">{voucher.voucherValue}</span>
                        <span className="currency">VND</span>
                      </div>
                      <div className="due-date">
                        {formatReadableDate(voucher.effectiveDate)} -{" "}
                        {formatReadableDate(voucher.validUntil)}
                      </div>
                      <div className="first-content">{voucher.description}</div>
                    </Col>
                    <Col className="info-code-voucher" lg="5" md="5">
                      <div className="second-content">
                        Applies to all invoices in the shop
                      </div>
                      <div className="text-enter-code">
                        <span>Enter code</span>
                      </div>
                      <div className="code">{voucher.voucherName}</div>
                      <div>AT CHECKOUT</div>
                      <div className="quantity">
                        Quantity: {voucher.quantity}
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          );
        })}
    </Fragment>
  );
};

export default BannerVoucher;
