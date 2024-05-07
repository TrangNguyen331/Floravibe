import React, { Fragment, useState } from "react";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import LayoutOne from "../../layouts/LayoutOne";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import axiosInstance from "../../axiosInstance";
import { useToasts } from "react-toast-notifications";

const ForgotPassword = ({ location }) => {
  const { pathname } = location;
  const { addToast } = useToasts();
  const [email, setEmail] = useState("");
  const handleSend = async () => {
    try {
      await axiosInstance
        .post("/api/v1/auth/forgot-password", { email })
        .then(() => {
          addToast("Send email success!", {
            appearance: "success",
            autoDismiss: true,
          });
        })
        .catch((error) => {
          addToast(error.response.data.message, {
            appearance: "error",
            autoDismiss: true,
          });
        });
    } catch (error) {}
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
        <div className="reset-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-5 col-md-12 ml-auto mr-auto">
                <p className="text-center">
                  We'll send you a password reset link
                </p>
                <div className="reset-input mt-7">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter username or email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="reset-btn">
                  <button onClick={handleSend}>Send</button>
                </div>
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
