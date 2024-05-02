import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import {useTranslation} from 'react-i18next';

const NavMenu = ({ strings, menuWhiteClass, sidebarMenu }) => {
  const {t} = useTranslation(['header']);
  return (
    <div
      className={` ${
        sidebarMenu
          ? "sidebar-menu"
          : `main-menu ${menuWhiteClass ? menuWhiteClass : ""}`
      } `}
    >
      <nav>
        <ul>
          <li>
            <Link to={process.env.PUBLIC_URL + "/"}>{t('home')}</Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/shop"}>{t('collection')}</Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/about"}>{t('about us')}</Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/policy"}>{t('our policy')}</Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/blog"}>{t('blog')}</Link>
          </li>
          {/* <li>
            <Link to={process.env.PUBLIC_URL + "/contact"}>Contact Us</Link>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

NavMenu.propTypes = {
  menuWhiteClass: PropTypes.string,
  sidebarMenu: PropTypes.bool,
  strings: PropTypes.object,
};

export default multilanguage(NavMenu);
