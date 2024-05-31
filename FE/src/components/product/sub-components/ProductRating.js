import PropTypes from "prop-types";
import React, { useState } from "react";

const ProductRating = ({ ratingValue, onChange, editable = true }) => {
  let rating = [];

  for (let i = 0; i < 5; i++) {
    rating.push(<i className="fa fa-star-o" key={i}></i>);
  }
  if (ratingValue && ratingValue > 0) {
    for (let i = 0; i <= ratingValue - 1; i++) {
      rating[i] = <i className="fa fa-star-o yellow" key={i}></i>;
    }
  }
  const [hoverValue, setHoverValue] = useState(0);

  const handleMouseOver = (value) => {
    if (editable) setHoverValue(value);
  };

  const handleMouseLeave = () => {
    if (editable) setHoverValue(0);
  };

  const handleClick = (value) => {
    if (editable) onChange(value);
  };
  return (
    <div className="product-rating">
      {[...Array(5)].map((_, index) => {
        const rating = index + 1;
        return (
          <i
            key={rating}
            className={
              (hoverValue >= rating || rating <= ratingValue
                ? "fa fa-star yellow"
                : "fa fa-star-o") + (rating <= ratingValue ? " rated" : "")
            }
            onMouseOver={() => handleMouseOver(rating)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(rating)}
          />
        );
      })}
    </div>
  );
};

ProductRating.propTypes = {
  ratingValue: PropTypes.number,
};

export default ProductRating;
