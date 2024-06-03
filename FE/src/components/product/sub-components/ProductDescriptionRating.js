import PropTypes from "prop-types";
import React from "react";

const ProductDescriptionRating = ({ ratingValue }) => {
  return (
    <div className="product-rating">
      {[...Array(5)].map((_, index) => {
        const rating = index + 1;
        return (
          <i
            key={rating}
            className={
              rating <= ratingValue ? "fa fa-star yellow" : "fa fa-star-o"
            }
          />
        );
      })}
    </div>
  );
};

ProductDescriptionRating.propTypes = {
  ratingValue: PropTypes.number,
};

export default ProductDescriptionRating;
