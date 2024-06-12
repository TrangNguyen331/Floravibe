import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import Paginator from "react-hooks-paginator";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { connect, useDispatch, useSelector } from "react-redux";
import { getSortedProducts } from "../../helpers/product";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ShopSidebar from "../../wrappers/product/ShopSidebar";
import ShopTopbar from "../../wrappers/product/ShopTopbar";
import ShopProducts from "../../wrappers/product/ShopProducts";
import axiosInstance from "../../axiosInstance";
import ProductModel from "../../model/productmodel";
import { useTranslation } from "react-i18next";
import { clearSelectedCategory } from "../../redux/actions/categoryActions";

const ShopGridStandard = ({ location }) => {
  const [layout, setLayout] = useState("grid three-column");
  const [sortType, setSortType] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [filterSortType, setFilterSortType] = useState("");
  const [filterSortValue, setFilterSortValue] = useState("");
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);

  const [visible, setVisible] = useState(6);

  const [search, setSearch] = useState("");
  const pageLimit = 999;
  const { pathname } = location;
  const { t } = useTranslation(["breadcrumb"]);
  const bannerCategory = useSelector(
    (state) => state.bannerCategory.selectedCategory
  );
  const fetchDataProduct = async (page, search) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/products/paging?size=${pageLimit}&search=${search}&page=${page}`
      );

      return response.data;
    } catch (error) {
      return [];
    }
  };
  const handleShowMore = () => {
    setVisible((prevCount) => prevCount + 6);
  };
  const handleSearch = (search) => {
    console.log("handle search");
    setSearch(search);
    fetchDataAndProcess(0, search);
  };
  const getLayout = (layout) => {
    setLayout(layout);
  };

  const getSortParams = (sortType, sortValue) => {
    console.log(sortType, sortValue);
    setSortType(sortType);
    setSortValue(sortValue);
  };

  const getFilterSortParams = (sortType, sortValue) => {
    setFilterSortType(sortType);
    setFilterSortValue(sortValue);
  };
  const dispatch = useDispatch();
  const fetchDataAndProcess = async (page, search) => {
    try {
      const response = await fetchDataProduct(0, search);
      console.log("Chou test");
      console.log(response);
      const products = response.content.map(
        (item) =>
          new ProductModel(
            item.id,
            item.name,
            item.description,
            item.additionalInformation,
            item.price,
            item.tags,
            item.images,
            item.reviews,
            item.collections,
            item.stockQty
          )
      );

      setProducts(products);

      // const originData = getSortedProducts(products, "", "");
      // console.log("origin", originData);
      let sortedProducts = getSortedProducts(products, sortType, sortValue);
      const filterSortedProducts = getSortedProducts(
        sortedProducts,
        filterSortType,
        filterSortValue
      );
      sortedProducts = filterSortedProducts;

      setSortedProducts(sortedProducts);
      console.log("sortedProducts", sortedProducts);
      setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  useEffect(() => {
    if (bannerCategory) {
      setSortType("category");
      setSortValue(bannerCategory);
      setSelectedCategory(bannerCategory);
    } else {
      fetchDataAndProcess(currentPage, search);
    }
    // Dependencies for the effect: offset, sortType, sortValue, filterSortType, filterSortValue
  }, [
    offset,
    sortType,
    sortValue,
    filterSortType,
    filterSortValue,
    search,
    currentPage,
    bannerCategory,
  ]);
  useEffect(() => {
    dispatch(clearSelectedCategory());
  }, []);
  return (
    <Fragment>
      <MetaTags>
        <title>Floravibe | Shop Page</title>
        <meta
          name="description"
          content="Shop page of flone react minimalist eCommerce template."
        />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {t("home")}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {t("shop")}
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />

        <div className="shop-area pt-95 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 order-2 order-lg-1">
                {/* shop sidebar */}
                <ShopSidebar
                  products={products}
                  getSortParams={getSortParams}
                  searchHandler={handleSearch}
                  sideSpaceClass="mr-30"
                  bannerCategory={selectedCategory}
                />
              </div>
              <div className="col-lg-9 order-1 order-lg-2">
                {/* shop topbar default */}
                <ShopTopbar
                  getLayout={getLayout}
                  getFilterSortParams={getFilterSortParams}
                  productCount={products.length}
                  sortedProductCount={currentData.length}
                />

                {/* shop page content default */}
                <ShopProducts
                  layout={layout}
                  products={currentData.slice(0, visible)}
                />

                {/* shop product showmore */}
                {visible < currentData.length && (
                  <div className="text-center mt-4 more-btn">
                    <button onClick={handleShowMore}>Show more</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

ShopGridStandard.propTypes = {
  location: PropTypes.object,
  products: PropTypes.array,
};

const mapStateToProps = (state) => {
  return {
    products: state.productData.products,
    bannerCategory: state.bannerCategory.selectedCategory,
  };
};

export default connect(mapStateToProps)(ShopGridStandard);
