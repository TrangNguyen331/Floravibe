import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setSelectedCategory } from "../../redux/actions/categoryActions";

const BannerOneSingle = ({ data, spaceBottomClass }) => {
  const dispatch = useDispatch();

  const handleBannerClick = (category) => {
    dispatch(setSelectedCategory(category));
    // Redirect to ShopGridStandard or perform any other action here
  };
  return (
    <div className="col-lg-4 col-md-4">
      <div
        className={`single-banner ${spaceBottomClass ? spaceBottomClass : ""}`}
        onClick={() => handleBannerClick(data.title)}
      >
        <Link to={process.env.PUBLIC_URL + data.link}>
          <img src={process.env.PUBLIC_URL + data.image} alt="" />
        </Link>
        <div className="banner-content">
          <h3>{data.title}</h3>
          <h4>
            {data.subtitle} <span>{data.price}</span>
          </h4>
          <Link to={process.env.PUBLIC_URL + data.link}>
            <i
              className="fa fa-long-arrow-right"
              onClick={() => handleBannerClick(data.title)}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

BannerOneSingle.propTypes = {
  data: PropTypes.object,
  spaceBottomClass: PropTypes.string,
};

export default BannerOneSingle;
