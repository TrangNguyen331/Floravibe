import { lazy } from "react";

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Orders = lazy(() => import("../pages/Orders"));
const ProductsAll = lazy(() => import("../pages/ProductsAll"));
const SingleProduct = lazy(() => import("../pages/SingleProduct"));
const AddProduct = lazy(() => import("../pages/AddProduct"));
const Customers = lazy(() => import("../pages/Customers"));
const Chats = lazy(() => import("../pages/Chats"));
const Profile = lazy(() => import("../pages/Profile"));
const Blogs = lazy(() => import("../pages/Blogs"));
const SingleBlog = lazy(() => import("../pages/SingleBlog"));
const Page404 = lazy(() => import("../pages/404"));
const Blank = lazy(() => import("../pages/Blank"));
const Vouchers = lazy(() => import("../pages/Vouchers"));
const Collection = lazy(() => import("../pages/Collection"));
const Tag = lazy(() => import("../pages/Tag"));
const SingleOrder = lazy(() => import("../pages/SingleOrder"));

const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard,
  },
  {
    path: "/orders",
    component: Orders,
  },
  {
    path: "/order/:id",
    component: SingleOrder,
  },
  {
    path: "/all-products",
    component: ProductsAll,
  },
  {
    path: "/add-product",
    component: AddProduct,
  },
  {
    path: "/product/:id",
    component: SingleProduct,
  },
  {
    path: "/customers",
    component: Customers,
  },
  {
    path: "/vouchers",
    component: Vouchers,
  },
  {
    path: "/collections/all",
    component: Collection,
  },
  {
    path: "/tags/all",
    component: Tag,
  },
  {
    path: "/chats",
    component: Chats,
  },
  {
    path: "/manage-profile",
    component: Profile,
  },
  {
    path: "/blogs",
    component: Blogs,
  },
  {
    path: "/blog/:id",
    component: SingleBlog,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/blank",
    component: Blank,
  },
];

export default routes;
