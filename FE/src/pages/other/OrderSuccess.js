import React, { Fragment } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const OrderSuccess = ({ location }) => {
  const { pathname } = location;
  const {t} = useTranslation(['orders', 'breadcrumb'])
  return (
    <Fragment>
      <MetaTags>
        <title>{t('breadcrumb:orders')} | {t('list.complete')}</title>
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>{t('breadcrumb:order-complete')}</BreadcrumbsItem>
      <LayoutOne>
        <Breadcrumb />
        <div className="container mt-5">
          <ul className="progressbar">
            <li className="active">{t('complete.shopping-cart')}</li>
            <li className="active">{t('complete.checkout')}</li>
            <li className="active">{t('complete.order-complete')}</li>
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
                      {t('complete.notice-order-success')}
                    </span>
                    <br />
                    <Link to={process.env.PUBLIC_URL + "/shop"}>
                      {t('complete.back-to-shop')}
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

export default OrderSuccess;
