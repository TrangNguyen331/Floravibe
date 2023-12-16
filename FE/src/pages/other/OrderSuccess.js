import React, { Fragment } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { Link } from "react-router-dom";

const OrderSuccess = ({ location }) => {
  const { pathname } = location;
  return (
    <Fragment>
      <MetaTags>
        <title>Order | Completed</title>
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Order Complete
      </BreadcrumbsItem>
      <LayoutOne>
        <Breadcrumb />
        <div className="container mt-5">
          <ul className="progressbar">
            <li className="active">Shopping Cart</li>
            <li className="active">Checkout</li>
            <li className="active">Order Complete</li>
          </ul>
        </div>
        <div className="thankyou-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="item-empty-area text-center">
                  <div className="item-empty-area__icon mb-30">
                    <i class="fa fa-check-circle-o" aria-hidden="true"></i>
                  </div>
                  <div className="item-empty-area__text">
                    <h2>Thank you!</h2>
                    <span className="text-secondary">
                      You order was successfuly completed.
                    </span>
                    <br />
                    <Link to={process.env.PUBLIC_URL + "/shop"}>
                      Back to Shop
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
