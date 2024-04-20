// import PropTypes from "prop-types";
import React, { Suspense, lazy } from "react";
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
// import { multilanguage, loadLanguages } from "redux-multilanguage";
// import { connect } from "react-redux";
import { BreadcrumbsProvider } from "react-breadcrumbs-dynamic";

const MyOrders = lazy(() => import("./pages/other/MyOrders"));
const Order = lazy(() => import("./pages/other/Order"));
const OrderSuccess = lazy(() => import("./pages/other/OrderSuccess"));
const HomePlants = lazy(() => import("./pages/home/HomePlants"));
const ShopGridStandard = lazy(() => import("./pages/shop/ShopGridStandard"));
const BlogRightSidebar = lazy(() => import("./pages/blog/BlogRightSidebar"));
const BlogDetailsStandard = lazy(() =>
  import("./pages/blog/BlogDetailsStandard")
);
const Product = lazy(() => import("./pages/shop-product/Product"));

// other pages
const About = lazy(() => import("./pages/other/About"));
const Contact = lazy(() => import("./pages/other/Contact"));
const MyAccount = lazy(() => import("./pages/other/MyAccount"));
const LoginRegister = lazy(() => import("./pages/other/LoginRegister"));

const Cart = lazy(() => import("./pages/other/Cart"));
const Wishlist = lazy(() => import("./pages/other/Wishlist"));
// const Compare = lazy(() => import("./pages/other/Compare"));
const Checkout = lazy(() => import("./pages/other/Checkout"));
const NotFound = lazy(() => import("./pages/other/NotFound"));
const Policy = lazy(() => import("./pages/other/Policy"));
const ResetPassword = lazy(() => import("./pages/other/ResetPassword"));
const App = () => {
  return (
    <ToastProvider placement="top-right">
      <BreadcrumbsProvider>
        <Router>
          <ScrollToTop>
            <Suspense
              fallback={
                <div className="flone-preloader-wrapper">
                  <div className="flone-preloader">
                    <span></span>
                    <span></span>
                  </div>
                </div>
              }
            >
              <Switch>
                <Route
                  path={process.env.PUBLIC_URL + "/"}
                  component={HomePlants}
                  exact
                />
                <Route
                  path={process.env.PUBLIC_URL + "/shop"}
                  component={ShopGridStandard}
                />

                <Route
                  path={process.env.PUBLIC_URL + "/blog"}
                  component={BlogRightSidebar}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/product/:id"}
                  render={(routeProps) => (
                    <Product {...routeProps} key={routeProps.match.params.id} />
                  )}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/blog-details-standard/:id"}
                  component={BlogDetailsStandard}
                />
                {/* Other pages */}
                <Route
                  path={process.env.PUBLIC_URL + "/about"}
                  component={About}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/contact"}
                  component={Contact}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/my-account"}
                  component={MyAccount}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/my-order"}
                  component={MyOrders}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/order/:id"}
                  component={Order}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/order-thankyou"}
                  component={OrderSuccess}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/login-register"}
                  component={LoginRegister}
                />

                <Route
                  path={process.env.PUBLIC_URL + "/cart"}
                  component={Cart}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/wishlist"}
                  component={Wishlist}
                />
                {/* <Route
                  path={process.env.PUBLIC_URL + "/compare"}
                  component={Compare}
                /> */}
                <Route
                  path={process.env.PUBLIC_URL + "/checkout"}
                  component={Checkout}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/resetpassword"}
                  component={ResetPassword}
                />

                <Route
                  path={process.env.PUBLIC_URL + "/not-found"}
                  component={NotFound}
                />
                <Route
                  path={process.env.PUBLIC_URL + "/policy"}
                  component={Policy}
                />

                <Route exact component={NotFound} />
              </Switch>
            </Suspense>
          </ScrollToTop>
        </Router>
      </BreadcrumbsProvider>
    </ToastProvider>
  );
};

// App.propTypes = {
//   dispatch: PropTypes.func,
// };
export default App;
// export default connect()(multilanguage(App));
