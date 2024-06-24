import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon, DashboardIcon } from "../icons";
import response from "../utils/demo/productData";
import { Card, CardBody, Badge, Button, Avatar } from "@windmill/react-ui";
import { genRating } from "../utils/genarateRating";
import axiosInstance from "../axiosInstance";
import { Box, Rating, Typography } from "@mui/material";
import ProductAvgRating from "../components/ProductAvgRating";
import StarBorder from "@mui/icons-material/StarBorder";
const SingleProduct = () => {
  const { id } = useParams();
  const [review, setReview] = useState({
    content: "",
  });
  const [product, setProduct] = useState(null);
  const [order, setOrder] = useState(null);

  // change view component
  const [tabView, setTabView] = useState("reviews");
  const handleTabView = (viewName) => setTabView(viewName);
  const formatReadableDate = (date) => {
    const parsedDate = new Date(date);
    // Format the date using Intl.DateTimeFormat
    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(parsedDate);
    return formattedDateTime;
  };
  //   get product
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/products/" + id);
      setProduct(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);
  console.log("getProduct", product);

  return (
    <div>
      <PageTitle>Product Details</PageTitle>
      {product ? (
        <div>
          {" "}
          {/* Breadcum */}
          <div className="flex text-gray-800 dark:text-gray-300">
            <div className="flex items-center text-purple-600">
              <Icon
                className="w-5 h-5"
                aria-hidden="true"
                icon={DashboardIcon}
              />
              <NavLink exact to="/app/dashboard" className="mx-2">
                Dashboard
              </NavLink>
            </div>
            {">"}
            <NavLink
              exact
              to="/app/all-products"
              className="mx-2 text-purple-600"
            >
              All Products
            </NavLink>
            {">"}
            <p className="mx-2">{product.name}</p>
          </div>
          {/* Product overview  */}
          <Card className="my-8 shadow-md">
            <CardBody>
              <div className="grid grid-col items-center md:grid-cols-2 lg:grid-cols-2">
                <div>
                  <img
                    src={product.images[0]}
                    alt=""
                    className="w-full rounded-lg"
                  />
                </div>

                <div className="mx-8 pt-5 md:pt-0">
                  <h1 className="text-3xl mb-4 font-semibold text-gray-700 dark:text-gray-200">
                    {product.name}
                  </h1>
                  <Box className="mb-2" display="flex" alignItems="center">
                    <ProductAvgRating product={product} /> {" "} ({product.reviews.length}{" "}
                      reviews)
                  </Box>
                  <h4 className="mt-4 text-purple-600 text-2xl font-semibold">
                    {product.price.toLocaleString("vi-VN")} {" "} ₫
                  </h4>
                  <div className="mb-5">
                    {product &&
                    product.collections &&
                    product.collections.length > 0
                      ? product.collections.map((collection, index) => (
                          <Badge
                            type="success"
                            key={collection.id}
                            className="mr-3 bg-purple-100 text-purple-700"
                          >
                            {collection.name}
                          </Badge>
                        ))
                      : ""}
                  </div>

                  <p className="mb-2 text-base text-gray-800 dark:text-gray-300">
                    {product.description}
                  </p>
                  <div className="mb-5">
                    Tags:
                    {product && product.tags && product.tags.length > 0
                      ? product.tags.map((tag, index) => (
                          <span
                            key={tag.id}
                            className="mx-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                          >
                            {tag.name}
                          </span>
                        ))
                      : ""}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          {/* Product Reviews and Description */}
          <Card className="my-8 shadow-md">
            <CardBody>
              {/* Navigation Area */}
              <div className="flex items-center">
                <Button
                  className="mx-5"
                  layout="link"
                  onClick={() => handleTabView("reviews")}
                >{`Reviews (${product.reviews.length})`}</Button>
                <Button
                  layout="link"
                  onClick={() => handleTabView("additionalInformation")}
                >
                  Additional Information
                </Button>
              </div>

              {/* Divider */}
              <hr className="mx-3 my-2 customeDivider" />

              {/* Component area */}
              <div className="mx-3 mt-4">
                {tabView === "reviews" ? (
                  <>
                    {genRating(product.reviews.length)}
                    <div className="mt-4">
                      {product.reviews.map((review, i) => (
                        <div className="flex justify-between py-3" key={i}>
                          <div className="flex">
                            <Avatar
                              className="hidden mr-3 md:block"
                              size="large"
                              src={review.account.avatar}
                              alt="User image"
                            />
                            <div>
                              <div>
                                <p className="font-medium text-lg text-gray-800 dark:text-gray-300">
                                  {review.account.username}{" "}
                                  <span className="text-sm text-gray-600 ml-2">
                                    {formatReadableDate(review.createDate)}
                                  </span>
                                </p>
                              </div>

                              <div>
                                <p className="text-sm mt-2 w-3/4 text-gray-600 dark:text-gray-400">
                                  {review.content}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end mt-2">
                            {review.ratingValue && review.ratingValue > 0 ? (
                              <Rating
                                  name="average-rating"
                                  size="small"
                                  value={review.ratingValue}
                                  precision={0.1}
                                  emptyIcon={<StarBorder style={{ fontSize: '18px' }}/>}
                                  readOnly
                                />
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : tabView === "additionalInformation" ? (
                  <>
                    <div
                      className="px-3"
                      dangerouslySetInnerHTML={{
                        __html: product.additionalInformation,
                      }}
                    ></div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SingleProduct;
