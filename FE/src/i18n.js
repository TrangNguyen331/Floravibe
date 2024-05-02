import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import header_en from "../src/locales/en/header.json";
import header_vi from "../src/locales/vi/header.json";
import home_en from "../src/locales/en/home.json";
import home_vi from "../src/locales/vi/home.json";
import product_en from "../src/locales/en/product.json";
import product_vi from "../src/locales/vi/product.json";
import breadcrumb_en from "../src/locales/en/breadcrumb.json";
import breadcrumb_vi from "../src/locales/vi/breadcrumb.json";
import order_en from "../src/locales/en/orders.json";
import order_vi from "../src/locales/vi/orders.json";
import myaccount_en from "../src/locales/en/my-account.json";
import myaccount_vi from "../src/locales/vi/my-account.json";
import checkout_en from "../src/locales/en/checkout.json";
import checkout_vi from "../src/locales/vi/checkout.json";
import wishlist_en from "../src/locales/en/wishlist.json";
import wishlist_vi from "../src/locales/vi/wishlist.json";
import loginregister_en from "../src/locales/en/login-register.json";
import loginregister_vi from "../src/locales/vi/login-register.json";


export const locales = {
    en: 'EN',
    vi: 'VI'
}


const resources = {
    en:{
        header: header_en,
        home: home_en,
        product: product_en,
        breadcrumb: breadcrumb_en,
        orders: order_en,
        myacc: myaccount_en,
        checkout: checkout_en,
        wishlist: wishlist_en,
        lore: loginregister_en
    },
    vi:{
        header: header_vi,
        home: home_vi,
        product: product_vi,
        breadcrumb: breadcrumb_vi,
        orders: order_vi,
        myacc: myaccount_vi,
        checkout: checkout_vi,
        wishlist: wishlist_vi,
        lore: loginregister_vi
    }
}
const defaultNS = 'header'

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    ns: ['home', 'header'],
    defaultNS,
    interpolation: {
        escapeValue: false
    }
})