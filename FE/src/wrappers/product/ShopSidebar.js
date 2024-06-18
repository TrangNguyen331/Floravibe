import PropTypes from "prop-types";
import React from "react";
import {
  getIndividualCategories,
  getIndividualTags,
  getIndividualColors,
  getProductsIndividualSizes,
} from "../../helpers/product";
import ShopSearch from "../../components/product/ShopSearch";
import ShopCategories from "../../components/product/ShopCategories";
import ShopTag from "../../components/product/ShopTag";
import ShopPriceFilter from "./ShopPriceFilter";

const ShopSidebar = ({
  products,
  getSortParams,
  sideSpaceClass,
  searchHandler,
  bannerCategory,
  resetFilters,
  isReset,
  getSortTagParams,
  getSortPriceParams,
}) => {
  const handleSearch = (search) => {
    searchHandler(search);
  };
  const uniqueCategories = getIndividualCategories(products);
  const uniqueTags = getIndividualTags(products);
  return (
    <div className={`sidebar-style ${sideSpaceClass ? sideSpaceClass : ""}`}>
      {/* shop search */}
      <ShopSearch searchHandle={handleSearch} />

      {/* filter by categories */}
      <ShopCategories
        categories={uniqueCategories}
        getSortParams={getSortParams}
        bannerCategory={bannerCategory}
        isReset={isReset}
      />
      {/* filter by price */}
      <ShopPriceFilter getSortParams={getSortPriceParams} isReset={isReset} />
      {/* filter by tag */}
      <ShopTag
        tags={uniqueTags}
        getSortParams={getSortTagParams}
        isReset={isReset}
      />

      <div className="mt-25 reset-filter-btn">
        <button onClick={resetFilters}>Clear all</button>
      </div>
    </div>
  );
};

ShopSidebar.propTypes = {
  getSortParams: PropTypes.func,
  products: PropTypes.array,
  sideSpaceClass: PropTypes.string,
  searchHandler: PropTypes.func,
  bannerCategory: PropTypes.string,
};

export default ShopSidebar;
