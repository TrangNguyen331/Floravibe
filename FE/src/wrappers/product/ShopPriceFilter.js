import React from "react";
import Slider from "@mui/material/Slider";
import { useState } from "react";

const ShopPriceFilter = () => {
  const [value, setValue] = useState([0, 10000000]);

  const handleInputChange = (event, index) => {
    const newValue = [...value];
    newValue[index] =
      event.target.value === "" ? "" : Number(event.target.value);
    setValue(newValue);
  };
  return (
    <div className="sidebar-widget mt-50">
      <h4 className="pro-sidebar-title">Price</h4>
      <div className="sidebar-widget-price mt-25">
        <div className="minmax-price mb-10">
          <input
            type="number"
            value={value[0]}
            min={0}
            max={10000000}
            step={10000}
            onChange={(e) => handleInputChange(e, 0)}
          />
          <span>-</span>
          <input
            type="number"
            value={value[1]}
            min={0}
            max={10000000}
            step={10000}
            onChange={(e) => handleInputChange(e, 1)}
          />
        </div>

        <div className="filter-price-btn">
          <button>Apply</button>
        </div>
      </div>
    </div>
  );
};

export default ShopPriceFilter;
