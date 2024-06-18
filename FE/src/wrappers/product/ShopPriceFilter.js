import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ShopPriceFilter = ({ getSortParams, isReset }) => {
  const [value, setValue] = useState(["", ""]);
  const [isError, setIsError] = useState(false);
  const handleInputChange = (event, index) => {
    const inputValue = event.target.value.trim();
    if (inputValue < 0) {
      setIsError(true);
    } else {
      setIsError(false);
      if (/^\d*$/.test(inputValue) && Number(inputValue) >= 0) {
        const newValue = [...value];
        newValue[index] = Number(inputValue);
        setValue(newValue);
      }
    }
  };
  const handlePriceClick = () => {
    if (!value[0] || !value[1]) {
      setIsError(true);
    } else {
      setIsError(false);
      getSortParams("priceRange", value);
    }
  };
  useEffect(() => {
    if (isReset) {
      setValue(["", ""]);
    }
  }, [isReset]);
  return (
    <div className="sidebar-widget mt-50">
      <h4 className="pro-sidebar-title">Price</h4>
      <div className="sidebar-widget-price mt-25">
        <div className="minmax-price">
          <input
            type="number"
            placeholder="MIN"
            value={value[0] || ""}
            min={0}
            max={10000000}
            step={10000}
            onChange={(e) => handleInputChange(e, 0)}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="MAX"
            value={value[1] || ""}
            min={0}
            max={10000000}
            step={10000}
            onChange={(e) => handleInputChange(e, 1)}
          />
        </div>
        <div className="filter-price-btn mt-12 mb-2">
          <button onClick={handlePriceClick}>Apply</button>
        </div>
        {isError ? (
          <div className="text-center">Please input valid price range</div>
        ) : null}
      </div>
    </div>
  );
};
ShopPriceFilter.propTypes = {
  getSortParams: PropTypes.func,
  isReset: PropTypes.bool,
};
export default ShopPriceFilter;
