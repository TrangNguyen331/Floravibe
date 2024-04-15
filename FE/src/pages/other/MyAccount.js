import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useToasts } from "react-toast-notifications";
import axiosInstance from "../../axiosInstance";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";

const MyAccount = ({ location }) => {
  const { pathname } = location;
  const { addToast } = useToasts();
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    fullName: "",
    ward: "",
    district: "",
    city: "",
    houseNumber: "",
    phone: "",
    email: "",
    avatar: "",
  });
  const token = useSelector((state) => state.auth.token);

  const [cities, setCities] = useState([]);

  const [passWord, setPassword] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleInputPasswordChange = (event) => {
    const { name, value } = event.target;
    setPassword({
      ...passWord,
      [name]: value,
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };
  const updateUserInfo = async () => {
    let selectedCityName = "";
    let selectedDistrictName = "";
    let selectedWardName = "";

    if (userInfo.city && userInfo.district && userInfo.ward) {
      const selectedCityData = cities.find(
        (city) => city.Name === userInfo.city
      );
      if (selectedCityData) {
        selectedCityName = selectedCityData.Name;
        const selectedDistrictData = selectedCityData.Districts.find(
          (district) => district.Name === userInfo.district
        );
        if (selectedDistrictData) {
          selectedDistrictName = selectedDistrictData.Name;
          const selectedWardData = selectedDistrictData.Wards.find(
            (ward) => ward.Name === userInfo.ward
          );
          if (selectedWardData) {
            selectedWardName = selectedWardData.Name;
          }
        }
      }
    }

    await axiosInstance
      .post("/api/v1/auth/info", {
        ...userInfo,
        ward: selectedWardName,
        district: selectedDistrictName,
        city: selectedCityName,
      })
      .then(() => {
        addToast("Update info success!", {
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
    console.log("userInfo", userInfo);
  };
  const updatePassword = async () => {
    await axiosInstance
      .post("/api/v1/auth/change-password", passWord)
      .then(() => {
        setPassword({
          ...passWord,
          password: "",
          confirmPassword: "",
        });
        addToast("Update password success!", {
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
  };

  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
      )
      .then((response) => {
        const hcmCity = response.data.filter(
          (city) => city.Name === "Thành phố Hồ Chí Minh"
        );
        setCities(hcmCity);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const setDataInit = async () => {
      if (token) {
        const response = await axiosInstance.get("/api/v1/auth/identity");
        setUserInfo({
          ...userInfo,
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          fullName: response.data.fullName || "",
          ward: response.data.ward || "",
          district: response.data.district || "",
          city: response.data.city || "",
          houseNumber: response.data.houseNumber || "",
          phone: response.data.phone || "",
          email: response.data.email || "",
          avatar: response.data.avatar || "",
        });
      }
    };
    setDataInit();
  }, []);

  return !token ? (
    <Redirect to={process.env.PUBLIC_URL + "/"}></Redirect>
  ) : (
    <Fragment>
      <MetaTags>
        <title>My Account</title>
        <meta name="My Account" content="My Account" />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        My Account
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ml-auto mr-auto col-lg-9">
                <div className="myaccount-wrapper">
                  <Accordion defaultActiveKey="0">
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="0">
                          <h3 className="panel-title">
                            <span>1 .</span> Edit your account information{" "}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>My Account Information</h4>
                              <h5>Your Personal Details</h5>
                            </div>
                            <div className="row">
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>First Name</label>
                                  <input
                                    type="text"
                                    name="firstName"
                                    value={userInfo.firstName}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Last Name</label>
                                  <input
                                    type="text"
                                    name="lastName"
                                    value={userInfo.lastName}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Full Name</label>
                                  <input
                                    type="text"
                                    name="fullName"
                                    value={userInfo.fullName}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Avatar</label>
                                  <input
                                    type="text"
                                    name="avatar"
                                    value={userInfo.avatar}
                                    placeholder="Avatar url"
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Address</label>
                                  <div>
                                    <select
                                      className="select-box form-select form-select-sm mb-3"
                                      name="city"
                                      value={userInfo.city}
                                      onChange={handleInputChange}
                                      aria-label=".form-select-sm"
                                    >
                                      <option value="" disabled>
                                        Choose Province/City
                                      </option>
                                      {cities.map((city) => (
                                        <option key={city.Id} value={city.Name}>
                                          {city.Name}
                                        </option>
                                      ))}
                                    </select>
                                    <select
                                      className="select-box form-select form-select-sm mb-3"
                                      name="district"
                                      value={userInfo.district}
                                      onChange={handleInputChange}
                                      // onChange={(e) => {
                                      //   setSelectedDistrict(e.target.value);
                                      //   setSelectedWard("");
                                      // }}
                                      aria-label=".form-select-sm"
                                    >
                                      <option value="" disabled>
                                        Choose District
                                      </option>
                                      {userInfo.city &&
                                        cities
                                          .find(
                                            (city) =>
                                              city.Name === userInfo.city
                                          )
                                          .Districts.map((district) => (
                                            <option
                                              key={district.Id}
                                              value={district.Name}
                                            >
                                              {district.Name}
                                            </option>
                                          ))}
                                    </select>

                                    <select
                                      className="select-box form-select form-select-sm"
                                      name="ward"
                                      value={userInfo.ward}
                                      onChange={handleInputChange}
                                      aria-label=".form-select-sm"
                                    >
                                      <option value="" disabled>
                                        Choose Ward
                                      </option>
                                      {userInfo.district &&
                                        cities
                                          .find(
                                            (city) =>
                                              city.Name === userInfo.city
                                          )
                                          .Districts.find(
                                            (district) =>
                                              district.Name ===
                                              userInfo.district
                                          )
                                          .Wards.map((ward) => (
                                            <option
                                              key={ward.Id}
                                              value={ward.Name}
                                            >
                                              {ward.Name}
                                            </option>
                                          ))}
                                    </select>
                                    <input
                                      className="billing-address"
                                      placeholder="House number and street name"
                                      type="text"
                                      name="houseNumber"
                                      value={userInfo.houseNumber}
                                      onChange={handleInputChange}
                                    />
                                  </div>

                                  {/* <label>Address</label>
                                    <input type="text" name="address"
                                      value={userInfo.address}
                                      onChange={handleInputChange} /> */}
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Telephone</label>
                                  <input
                                    type="text"
                                    name="phone"
                                    value={userInfo.phone}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Email</label>
                                  <input
                                    type="email"
                                    name="email"
                                    value={userInfo.email}
                                    onChange={handleInputChange}
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="submit" onClick={updateUserInfo}>
                                  Update
                                </button>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                    <Card className="single-my-account mb-20">
                      <Card.Header className="panel-heading">
                        <Accordion.Toggle variant="link" eventKey="1">
                          <h3 className="panel-title">
                            <span>2 .</span> Change your password
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>Change Password</h4>
                              <h5>Your Password</h5>
                            </div>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Password</label>
                                  <input
                                    type="password"
                                    name="password"
                                    value={passWord.password}
                                    onChange={handleInputPasswordChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Password Confirm</label>
                                  <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passWord.confirmPassword}
                                    onChange={handleInputPasswordChange}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="submit" onClick={updatePassword}>
                                  Update
                                </button>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

MyAccount.propTypes = {
  location: PropTypes.object,
};

export default MyAccount;
