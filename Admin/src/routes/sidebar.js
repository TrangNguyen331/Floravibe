/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: "/app/dashboard", // the url
    icon: "HomeIcon", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },
  {
    path: "/app/orders",
    icon: "CartIcon",
    name: "Orders",
  },
  {
    path: "/app/all-products",
    icon: "TruckIcon",
    name: "Products",
    // routes: [
    //   {
    //     path: "/app/all-products",
    //     name: "All Products",
    //   },

    // ],
  },
  {
    path: "/app/customers",
    icon: "GroupIcon",
    name: "Customers",
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
    icon: "InvoiceIcon",
    name: "Blogs",
  },
  {
    path: "/app/log-out",
    icon: "OutlineLogoutIcon",
    name: "Logout",
  },
];

export default routes;