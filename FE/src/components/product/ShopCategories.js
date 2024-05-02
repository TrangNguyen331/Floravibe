import PropTypes from "prop-types";
import React from "react";
import { setActiveSort } from "../../helpers/product";
import { useTranslation } from "react-i18next";

const ShopCategories = ({ categories, getSortParams }) => {
  console.log("categories",categories);
  const {t} = useTranslation(['product']);
  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">{t('sidebar.categories')}</h4>
      <div className="sidebar-widget-list mt-30">
        {categories ? (
          <ul>
            <li>
              <div className="sidebar-widget-list-left">
                <button
                  onClick={e => {
                    getSortParams("category", "");
                    setActiveSort(e);
                  }}
                >
                  <span className="checkmark" />{t('sidebar.all-categories')}
                </button>
              </div>
            </li>
            {categories.map((category, key) => {
              return (
                <li key={key}>
                  <div className="sidebar-widget-list-left">
                    <button
                      onClick={e => {
                        getSortParams("category", category);
                        setActiveSort(e);
                      }}
                    >
                      {" "}
                      <span className="checkmark" /> {category}{" "}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          t('sidebar.no-product')
        )}
      </div>
    </div>
  );
};

ShopCategories.propTypes = {
  categories: PropTypes.array,
  getSortParams: PropTypes.func
};

export default ShopCategories;
