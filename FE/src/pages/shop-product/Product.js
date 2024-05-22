import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { connect } from "react-redux";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import RelatedProductSlider from "../../wrappers/product/RelatedProductSlider";
import ProductDescriptionTab from "../../wrappers/product/ProductDescriptionTab";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";

import { useParams } from "react-router-dom";
import ProductModel from "../../model/productmodel";
import axiosInstance from "../../axiosInstance";
import VoucherSlider from "../../wrappers/voucher-banner/VoucherSlider";
import { useTranslation } from "react-i18next";

const Product = ({ location }) => {
  const [product, setProduct] = useState({
    id: "",
    name: "",
    description: "",
    additionalInformation: "",
    price: "",
    tags: [],
    images: [],
    reviews: [],
    collections: [],
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const { pathname } = location;
  const { id } = useParams();
  const { t } = useTranslation(["breadcrumb"]);
  useEffect(() => {
    const fetchData = async (productId) => {
      const response = await axiosInstance.get(`/api/v1/products/${productId}`);

      setProduct(
        new ProductModel(
          response.data.id,
          response.data.name,
          response.data.description,
          response.data.additionalInformation,
          response.data.price,
          response.data.tags,
          response.data.images,
          response.data.reviews,
          response.data.collections,
          response.data.stockQty
        )
      );
      setIsLoaded(true);
    };
    fetchData(id);
  }, [id]);
  return isLoaded ? (
    <Fragment>
      <MetaTags>
        <title>Floravibe | {t("shop-product")}</title>
        <meta name="description" content="Product page." />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {t("home")}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {t("shop-product")}
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />

        {/* product description with image */}
        <ProductImageDescription
          spaceTopClass="pt-100"
          spaceBottomClass="pb-100"
          product={product}
        />

        {/* product description tab */}
        <ProductDescriptionTab spaceBottomClass="pb-90" product={product} />

        {/* related product slider */}
        <RelatedProductSlider
          spaceBottomClass="pb-95"
          category={product.collections ? product.collections[0] : ""}
        />
        {/* banner slider */}
        <VoucherSlider spaceBottomClass="pb-95" />
      </LayoutOne>
    </Fragment>
  ) : (
    ""
  );
};

Product.propTypes = {
  location: PropTypes.object,
  product: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  const itemId = ownProps.match.params.id;
  return {
    product: state.productData.products.filter(
      (single) => single.id === itemId
    )[0],
  };
};

export default connect(mapStateToProps)(Product);
