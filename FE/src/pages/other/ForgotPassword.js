import React, { Fragment, useState } from "react";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import LayoutOne from "../../layouts/LayoutOne";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import axiosInstance from "../../axiosInstance";
import { useToasts } from "react-toast-notifications";
import { Link } from "react-router-dom";
const ForgotPassword = ({ location }) => {
  const { pathname } = location;
  const { addToast } = useToasts();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState(""); // Store the sent email
  const handleSend = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/v1/auth/forgot-password",
        { email },
        { timeout: 6000 }
      );
      console.log("Response:", response);
      addToast("Send email success!", {
        appearance: "success",
        autoDismiss: true,
      });
      setIsSent(true);
      setSentEmail(email);
      setEmail("");
    } catch (error) {
      console.log("Error:", error);
      if (error.response && error.response.data) {
        console.log("Error Response Data:", error.response.data);
        addToast(error.response.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
      } else {
        addToast("An error occurred. Please try again.", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Fragment>
      <MetaTags>
        <title>Forgot Password</title>
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Reset Password
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="reset-area pt-80 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-5 col-md-12 ml-auto mr-auto">
                {isSent ? (
                  <div className="email-sent-message">
                    <i className="fa fa-envelope-o" aria-hidden="true" />
                    <h3>Check your email</h3>
                    <p>We sent a reset link to {sentEmail}</p>
                  </div>
                ) : (
                  <div>
                    <div className="send-mail-line">
                      We'll send you a password reset link
                    </div>
                    <p className="font-bold">Email</p>
                    <div className="reset-input">
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="reset-btn">
                      <button onClick={handleSend} disabled={isLoading}>
                        {isLoading ? (
                          <div className="loading-send">
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Send
                          </div>
                        ) : (
                          "Send"
                        )}
                      </button>
                    </div>
                    {/* <Link to={process.env.PUBLIC_URL + "/login-register"}>
                      <i className="fa fa-long-arrow-left" aria-hidden="true" />{" "}
                      Back to Login
                    </Link> */}
                  </div>
                )}
                <Link to={process.env.PUBLIC_URL + "/login-register"}>
                  <i className="fa fa-long-arrow-left" aria-hidden="true" />{" "}
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};
ForgotPassword.propTypes = {
  location: PropTypes.object,
};
export default ForgotPassword;
