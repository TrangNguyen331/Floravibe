import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { loginUser, registerUser } from "../../redux/actions/authAction";
import { useToasts } from "react-toast-notifications";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { useTranslation } from "react-i18next";


const LoginRegister = ({ location }) => {
  const { pathname } = location;
  const { addToast } = useToasts();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });

  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.auth.token);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    await dispatch(loginUser(formData.username, formData.password, addToast));

  }
  const handleRegister = async (event) => {
    event.preventDefault();
    await dispatch(registerUser(formData.username, formData.password, formData.email, addToast));
    setFormData({
      ...formData,
      username: '',
      password: '',
      email: ''
    })
  }

  const {t} = useTranslation(['lore', 'breadcrumb']);

  return (
    isLogin ? (<Redirect to={process.env.PUBLIC_URL + "/"}></Redirect>) : (
      <Fragment>
        <MetaTags>
          <title>{t('login')} | {t('register')}</title>
          <meta
            name="Login | Register"
            content="Login | Register"
          />
        </MetaTags>
        <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>{t('breadcrumb:home')}</BreadcrumbsItem>
        <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>{t('breadcrumb:login-register')}</BreadcrumbsItem>
        <LayoutOne headerTop="visible">
          {/* breadcrumb */}
          <Breadcrumb />
          <div className="login-register-area pt-100 pb-100">
            <div className="container">
              <div className="row">
                <div className="col-lg-7 col-md-12 ml-auto mr-auto">
                  <div className="login-register-wrapper">
                    <Tab.Container defaultActiveKey="login">
                      <Nav variant="pills" className="login-register-tab-list">
                        <Nav.Item>
                          <Nav.Link eventKey="login">
                            <h4>{t('login')}</h4>
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="register">
                            <h4>{t('register')}</h4>
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                      <Tab.Content>
                        <Tab.Pane eventKey="login">
                          <div className="login-form-container">
                            <div className="login-register-form">
                              <form onSubmit={handleLogin}>
                                <input
                                  type="text"
                                  name="username"
                                  value={formData.username}
                                  onChange={handleInputChange}
                                  placeholder={t('username')}
                                />
                                <input
                                  type="password"
                                  name="password"
                                  value={formData.password}
                                  onChange={handleInputChange}
                                  placeholder={t('password')}
                                />
                                <div className="button-box">
                                  {/* <div className="login-toggle-btn">
                                    <input type="checkbox" />
                                    <label className="ml-10">Remember me</label>
                                    <Link to={process.env.PUBLIC_URL + "/"}>
                                      Forgot Password?
                                    </Link>
                                  </div> */}
                                  <button type="submit">
                                    <span>{t('login')}</span>
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="register">
                          <div className="login-form-container">
                            <div className="login-register-form">
                              <form onSubmit={handleRegister}>
                                <input
                                  type="text"
                                  name="username"
                                  value={formData.username}
                                  onChange={handleInputChange}
                                  placeholder="Username"
                                />
                                <input
                                  type="password"
                                  name="password"
                                  value={formData.password}
                                  onChange={handleInputChange}
                                  placeholder="Password"
                                />
                                <input
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  placeholder="Email"
                                  type="email"
                                />
                                <div className="button-box">
                                  <button type="submit">
                                    <span>Register</span>
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LayoutOne>
      </Fragment>
    )
  );
};

LoginRegister.propTypes = {
  location: PropTypes.object
};

export default LoginRegister;
