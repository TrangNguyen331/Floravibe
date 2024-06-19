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
import axiosImgBB from "../../axiosImgBB";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { useTranslation } from "react-i18next";

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

  const handleInputChange = (property, value) => {
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [property]: value,
    }));
    console.log(property, value);
  };
  const API_KEY = process.env.REACT_APP_IMAGE_HOSTING_KEY;
  const handleImgChange = async (e) => {
    const file = e.target.files[0];
    handleInputChange("avatar", file);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axiosImgBB.post(
        `https://api.imgbb.com/1/upload?key=${API_KEY}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      handleInputChange("avatar", response.data.data.url);
      console.log(formData);
      console.log(response.data.data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const updateUserInfo = async () => {
    let selectedCityName = userInfo.city || "";
    let selectedDistrictName = userInfo.district || "";
    let selectedWardName = userInfo.ward || ""; // Default to empty string if ward is not selected

    const selectedCityData = cities.find(
      (city) => city.Name === selectedCityName
    );

    if (!selectedCityData) {
      selectedCityName = "";
      selectedDistrictName = ""; // Reset district if city is not found
    } else {
      const selectedDistrictData = selectedCityData.Districts.find(
        (district) => district.Name === selectedDistrictName
      );

      if (!selectedDistrictData) {
        selectedDistrictName = ""; // Reset district if not found within the city
      } else if (selectedWardName) {
        const selectedWardData = selectedDistrictData.Wards.find(
          (ward) => ward.Name === selectedWardName
        );

        if (!selectedWardData) {
          selectedWardName = ""; // Reset ward if not found within the district
        }
      }
    }

    const payload = {
      ...userInfo,
      city: selectedCityName,
      district: selectedDistrictName,
      ward: selectedWardName, // Include the ward in the payload
    };

    await axiosInstance
      .post("/api/v1/auth/info", payload)
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
  const { t } = useTranslation(["myacc", "breadcrumb"]);
  return !token ? (
    <Redirect to={process.env.PUBLIC_URL + "/"}></Redirect>
  ) : (
    <Fragment>
      <MetaTags>
        <title>Floravibe | {t("breadcrumb:my-account")}</title>
        <meta name="My Account" content="My Account" />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {t("breadcrumb:home")}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {t("breadcrumb:my-account")}
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
                            <span>1 .</span> {t("edit-acc")}{" "}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>{t("my-acc")}</h4>
                              <h5>{t("per-detail")}</h5>
                            </div>
                            <div className="row">
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>{t("first-name")}</label>
                                  <input
                                    type="text"
                                    value={userInfo.firstName}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "firstName",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>{t("last-name")}</label>
                                  <input
                                    type="text"
                                    value={userInfo.lastName}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "lastName",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>{t("full-name")}</label>
                                  <input
                                    type="text"
                                    value={userInfo.fullName}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "fullName",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>{t("avatar")}</label>
                                  <label className="avatar-update-area">
                                    <input
                                      type="file"
                                      placeholder="Avatar url"
                                      className="upload-input"
                                      onChange={handleImgChange}
                                    />
                                    <div className="avatar-info">
                                      {userInfo && userInfo.avatar ? (
                                        <img
                                          src={userInfo.avatar}
                                          alt={`avatar image`}
                                          className="avatar-image"
                                        />
                                      ) : (
                                        <img
                                          src="https://i.pinimg.com/originals/90/48/9f/90489fda05254bb2fef245248e9befb1.jpg"
                                          alt="default"
                                          className="avatar-image"
                                        />
                                      )}
                                      <div className="overlay">
                                        <i className="fa fa-camera" />
                                      </div>
                                    </div>
                                  </label>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>{t("address")}</label>
                                  <div>
                                    <select
                                      className="select-box form-select form-select-sm mb-3"
                                      name="city"
                                      value={userInfo.city}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "city",
                                          e.target.value
                                        )
                                      }
                                      aria-label=".form-select-sm"
                                    >
                                      <option value="" disabled>
                                        {t("city")}
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
                                      onChange={(e) =>
                                        handleInputChange(
                                          "district",
                                          e.target.value
                                        )
                                      }
                                      aria-label=".form-select-sm"
                                    >
                                      <option value="" disabled>
                                        {t("district")}
                                      </option>
                                      {userInfo.city &&
                                        cities.some(
                                          (city) => city.Name === userInfo.city
                                        ) &&
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
                                      onChange={(e) =>
                                        handleInputChange(
                                          "ward",
                                          e.target.value
                                        )
                                      }
                                      aria-label=".form-select-sm"
                                    >
                                      <option value="" disabled>
                                        {t("ward")}
                                      </option>
                                      {userInfo.district &&
                                        cities.some(
                                          (city) => city.Name === userInfo.city
                                        ) &&
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
                                      placeholder={t("detail-address")}
                                      type="text"
                                      name="houseNumber"
                                      value={userInfo.houseNumber}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "houseNumber",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>{t("phone")}</label>
                                  <input
                                    type="text"
                                    name="phone"
                                    value={userInfo.phone}
                                    onChange={(e) =>
                                      handleInputChange("phone", e.target.value)
                                    }
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
                                    onChange={(e) =>
                                      handleInputChange("email", e.target.value)
                                    }
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="submit" onClick={updateUserInfo}>
                                  {t("update")}
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
                            <span>2 .</span> {t("text-change-pasword")}
                          </h3>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="1">
                        <Card.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>{t("change-password")}</h4>
                              <h5>{t("your-pasword")}</h5>
                            </div>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>{t("pasword")}</label>
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
                                  <label>{t("confirm")}</label>
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
                                  {t("update")}
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
