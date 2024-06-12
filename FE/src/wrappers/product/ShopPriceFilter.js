import React from "react";
import Slider from "@mui/material/Slider";
import { useState } from "react";

const ShopPriceFilter = () => {
  const [value, setValue] = useState([0, 10000000]);
  const rangeSelector = (event, newValue) => {
    setValue(newValue);
  };
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
        <Slider
          value={value}
          min={0}
          max={10000000}
          step={10000}
          onChange={rangeSelector}
          valueLabelDisplay="auto"
          sx={{
            "& .MuiSlider-thumb": {
              color: "#a749ff",
            },
            "& .MuiSlider-track": {
              color: "#a749ff",
            },
          }}
        />
        <div className="price-bottom mt-10">
          <div className="minmax-price">
            <span>{value[0]}đ</span>
            {/* <input
              type="number"
              value={value[0]}
              min={0}
              max={10000000}
              step={10000}
              onChange={(e) => handleInputChange(e, 0)}
            /> */}

            <span>-</span>

            {/* <input
              type="number"
              value={value[1]}
              min={0}
              max={10000000}
              step={10000}
              onChange={(e) => handleInputChange(e, 1)}
            /> */}
            <span>{value[1]}đ</span>
          </div>
          <div className="filter-price-btn">
            <button>Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPriceFilter;
