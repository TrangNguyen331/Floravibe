import React, { Fragment, useState } from "react";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import LayoutOne from "../../layouts/LayoutOne";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";

const ResetPassword = ({ location }) => {
  const { pathname } = location;
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const showHide = (inputName) => {
    setShowPassword({
      ...showPassword,
      [inputName]: !showPassword[inputName],
    });
  };
  return (
    <Fragment>
      <MetaTags>
        <title>Reset Password</title>
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Reset Password
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="reset-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-5 col-md-12 ml-auto mr-auto">
                <p className="text-center">
                  Enter a new password for your account
                </p>
                <div className="reset-input mt-7">
                  <input
                    type={showPassword.newPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="New Password"
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => showHide("newPassword")}
                  >
                    {showPassword.newPassword ? (
                      <i className="ri-eye-off-line" />
                    ) : (
                      <i className="ri-eye-line" />
                    )}
                  </span>
                </div>
                <div className="reset-input">
                  <input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Password Confirm"
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => showHide("confirmPassword")}
                  >
                    {showPassword.confirmPassword ? (
                      <i className="ri-eye-off-line" />
                    ) : (
                      <i className="ri-eye-line" />
                    )}
                  </span>
                </div>
                <div className="reset-btn">
                  <button>Reset</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};
ResetPassword.propTypes = {
  location: PropTypes.object,
};
export default ResetPassword;
