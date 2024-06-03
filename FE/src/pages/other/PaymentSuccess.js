import React, { Fragment, useEffect, useState } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../axiosInstance";

const PaymentSuccess = ({ location }) => {
  const { pathname } = location;
  const { t } = useTranslation(["orders", "breadcrumb"]);
  const [submitData, setSubmitData] = useState({
    orderId: "",
    vnp_BankCode: "",
    vnp_BankTranNo: "",
    vnp_ResponseCode: "",
    vnp_TransactionNo: "",
    vnp_TransactionStatus: "",
  });

  useEffect(() => {
    getUrlParams(window.location.search);
  }, []);
  console.log(submitData);
  const getUrlParams = async (url) => {
    if (url) {
      const params = new URLSearchParams(url);
      const vnp_BankCode = params.get("vnp_BankCode");
      const vnp_BankTranNo = params.get("vnp_BankTranNo");
      const vnp_CardType = params.get("vnp_CardType");
      const vnp_PayDate = params.get("vnp_PayDate");
      const vnp_ResponseCode = params.get("vnp_ResponseCode");
      const vnp_TransactionNo = params.get("vnp_TransactionNo");
      const vnp_TransactionStatus = params.get("vnp_TransactionStatus");

      // Extract order ID from vnp_OrderInfo
      const vnp_OrderInfo = params.get("vnp_OrderInfo");
      const orderId = vnp_OrderInfo.match(/\[OrderID\]\:\s*([\w\d]+)/)[1];

      setSubmitData({
        orderId: orderId,
        vnp_BankCode: vnp_BankCode,
        vnp_BankTranNo: vnp_BankTranNo,
        vnp_CardType: vnp_CardType,
        vnp_PayDate: vnp_PayDate,
        vnp_ResponseCode: vnp_ResponseCode,
        vnp_TransactionNo: vnp_TransactionNo,
        vnp_TransactionStatus: vnp_TransactionStatus,
      });

      let body = {
        status: "SUCCESS",
        transactionDetail: `${vnp_TransactionNo};${vnp_BankCode};${vnp_BankTranNo};${vnp_CardType};${vnp_ResponseCode};${vnp_ResponseCode};${vnp_TransactionStatus}`,
        payDate: vnp_PayDate,
      };
      await axiosInstance.patch(
        `api/v1/orders/${orderId}/payment/vnpay-callback`,
        body
      );
      console.log("done");
    }
  };

  return (
    <Fragment>
      <MetaTags>
        <title>
          {t("breadcrumb:orders")} | {t("list.complete")}
        </title>
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {t("breadcrumb:order-complete")}
      </BreadcrumbsItem>
      <LayoutOne>
        <Breadcrumb />
        <div className="container mt-5">
          <ul className="progressbar">
            <li className="active">{t("complete.shopping-cart")}</li>
            <li className="active">{t("complete.checkout")}</li>
            <li className="active">{t("complete.order-complete")}</li>
          </ul>
        </div>
        <div className="thankyou-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="item-empty-area text-center">
                  <div className="item-empty-area__icon mb-30">
                    <i className="fa fa-check-circle-o" aria-hidden="true"></i>
                  </div>
                  <div className="item-empty-area__text">
                    <h2>Thank you!</h2>
                    <span className="text-secondary">
                      {t("complete.notice-order-success")}
                    </span>
                    <br />
                    <Link to={process.env.PUBLIC_URL + "/shop"}>
                      {t("complete.back-to-shop")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default PaymentSuccess;
