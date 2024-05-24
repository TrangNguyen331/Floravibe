/**
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: "/app/dashboard", // the url
    icon: "DashboardIcon", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/app/orders",
    icon: "CartIcon",
    name: "Orders",
  },
  {
    icon: "FlowerIcon",
    name: "Products",
    routes: [
      {
        path: "/app/all-products",
        name: "All Products",
      },
      {
        path: "/app/add-product",
        name: "Add Product",
      },
    ],
  },
  {
    path: "/app/customers",
    icon: "GroupIcon",
    name: "Accounts",
  },
  // {
  //   path: "/app/chats",
  //   icon: "ChatIcon",
  //   name: "Chats",
  // },
  // {
  //   path: "/app/manage-profile",
  //   icon: "UserIcon",
  //   name: "Profile",
  // },
  {
    path: "/app/blogs",
    icon: "BlogIcon",
    name: "Blogs",
  },
  {
    path: "/app/vouchers",
    icon: "VoucherICon",
    name: "Vouchers",
  },
  {
    path: "/app/log-out",
    icon: "OutlineLogoutIcon",
    name: "Logout",
  },
];

export default routes;
