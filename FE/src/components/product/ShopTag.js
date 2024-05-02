import PropTypes from "prop-types";
import React from "react";
import { setActiveSort } from "../../helpers/product";
import { useTranslation } from "react-i18next";

const ShopTag = ({ tags, getSortParams }) => {
  const {t} = useTranslation(['product']);
  console.log("tags",tags)
  return (
    <div className="sidebar-widget mt-50">
      <h4 className="pro-sidebar-title">{t('sidebar.tag')} </h4>
      <div className="sidebar-widget-tag mt-25">
        {tags ? (
          <ul>
            {tags.map((tag, key) => {
              return (
                <li key={key}>
                  <button
                    onClick={e => {
                      getSortParams("tag", tag);
                      setActiveSort(e);
                    }}
                  >
                    {tag}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          t('sidebar.no-tag')
        )}
      </div>
    </div>
  );
};

ShopTag.propTypes = {
  getSortParams: PropTypes.func,
  tags: PropTypes.array
};

export default ShopTag;
