import PropTypes from "prop-types";
import React from "react";
import { setActiveLayout } from "../../helpers/product";
import { useTranslation } from "react-i18next";

const ShopTopAction = ({
  getLayout,
  getFilterSortParams,
  productCount,
  sortedProductCount
}) => {
  const {t} = useTranslation(['product']);
  return (
    <div className="shop-top-bar mb-35">
      <div className="select-shoing-wrap">
        <div className="shop-select">
          <select
            onChange={e => getFilterSortParams("filterSort", e.target.value)}
          >
            <option value="default">{t('sort.default')}</option>
            <option value="priceHighToLow">{t('sort.price-desc')}</option>
            <option value="priceLowToHigh">{t('sort.price-asc')}</option>
          </select>
        </div>
        <p>
          {t('gridproduct.show-qty')} {sortedProductCount} {t('gridproduct.of-qty')} {productCount} {t('gridproduct.result-qty')}
        </p>
      </div>

      <div className="shop-tab">
        <button
          onClick={e => {
            getLayout("grid two-column");
            setActiveLayout(e);
          }}
        >
          <i className="fa fa-th-large" />
        </button>
        <button
          onClick={e => {
            getLayout("grid three-column");
            setActiveLayout(e);
          }}
        >
          <i className="fa fa-th" />
        </button>
        <button
          onClick={e => {
            getLayout("list");
            setActiveLayout(e);
          }}
        >
          <i className="fa fa-list-ul" />
        </button>
      </div>
    </div>
  );
};

ShopTopAction.propTypes = {
  getFilterSortParams: PropTypes.func,
  getLayout: PropTypes.func,
  productCount: PropTypes.number,
  sortedProductCount: PropTypes.number
};

export default ShopTopAction;
