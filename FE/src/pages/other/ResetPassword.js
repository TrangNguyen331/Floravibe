import React, { Fragment, useState } from "react";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import LayoutOne from "../../layouts/LayoutOne";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import axiosInstance from "../../axiosInstance";
import { useToasts } from "react-toast-notifications";
import { Link } from "react-router-dom";

const ResetPassword = ({ location }) => {
  const { pathname } = location;
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [passWord, setPassword] = useState({
    password: "",
    confirmPassword: "",
  });
  const queryParams = new URLSearchParams(window.location.search);
  const userName = queryParams.get("userName");

  const showHide = (inputName) => {
    setShowPassword({
      ...showPassword,
      [inputName]: !showPassword[inputName],
    });
  };
  const handleInputPasswordChange = (event) => {
    const { name, value } = event.target;
    setPassword({
      ...passWord,
      [name]: value,
    });
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    const body = {
      password: passWord.password,
      confirmPassword: passWord.confirmPassword,
    };
    try {
      await axiosInstance.post(
        `/api/v1/auth/resetpassword/change-password/${userName}`,
        body
      );

      setPassword({
        password: "",
        confirmPassword: "",
      });
      setIsReset(true);
      addToast("Update password success!", {
        appearance: "success",
        autoDismiss: true,
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
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
                {isReset ? (
                  <div className="reset-success-area">
                    <i className="fa fa-check" aria-hidden="true" />
                    <p>Your password has been reset</p>
                    <h3>Successfully</h3>
                    <div className="reset-btn">
                      <Link to={process.env.PUBLIC_URL + "/login-register"}>
                        Countinue
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="icon-lock">
                      <i className="pe-7s-lock" />
                    </div>
                    <p className="text-center">
                      Enter a new password for your account
                    </p>
                    <div className="reset-input mt-7">
                      <input
                        type={showPassword.password ? "text" : "password"}
                        name="password"
                        placeholder="New Password"
                        value={passWord.password}
                        onChange={handleInputPasswordChange}
                      />
                      <span
                        className="password-toggle-icon"
                        onClick={() => showHide("password")}
                      >
                        {showPassword.password ? (
                          <i className="ri-eye-off-line" />
                        ) : (
                          <i className="ri-eye-line" />
                        )}
                      </span>
                    </div>
                    <div className="reset-input">
                      <input
                        type={
                          showPassword.confirmPassword ? "text" : "password"
                        }
                        name="confirmPassword"
                        placeholder="Password Confirm"
                        value={passWord.confirmPassword}
                        onChange={handleInputPasswordChange}
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
                      <button
                        onClick={handleResetPassword}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="loading-send">
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Reset
                          </div>
                        ) : (
                          "Reset"
                        )}
                      </button>
                    </div>
                  </div>
                )}
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
