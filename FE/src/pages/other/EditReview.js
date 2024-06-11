import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";
import axiosInstance from "../../axiosInstance";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import ProductRating from "../../components/product/sub-components/ProductRating";

const EditReview = (props) => {
  const { t } = useTranslation(["product", "breadcrumb"]);
  const { addToast } = useToasts();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [order, setOrder] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewContent, setReviewContent] = useState({
    id: "",
    content: "",
    ratingValue: 0,
  });
  const [initialReviewContent, setInitialReviewContent] = useState({
    id: "",
    content: "",
    ratingValue: 0,
  });
  const fecthOrder = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/orders/" + props.orderId
      );
      setOrder(response.data.details);
      console.log("order", response.data);
      console.log("details", response.data.details);
    } catch (error) {
      console.log("Fail to load Order");
    }
  };
  const clickEdit = (productId) => {
    setSelectedProduct(productId);
    const result =
      order && order.some((item) => item.productId === productId)
        ? order.find((item) => item.productId === productId)
        : null;
    if (result) {
      const review = result.product.reviews.find(
        (item) => item.orderId === props.orderId
      );
      if (review) {
        const reviewData = {
          id: review.id,
          content: review.content,
          ratingValue: review.ratingValue,
        };
        setReviewContent(reviewData);
        setInitialReviewContent(reviewData);
      }
      console.log(result);
    }
    setShowEdit(true);
  };
  const clickSave = async (productId) => {
    console.log(reviewContent);
    try {
      setLoadingSubmit(true);
      var body = {
        content: reviewContent.content,
        ratingValue: reviewContent.ratingValue,
      };
      await axiosInstance.put(
        `/api/v1/products/review/${productId}/${reviewContent.id}?orderId=${props.orderId}`,
        body
      );
      fecthOrder();
      addToast("Update review success", {
        appearance: "success",
        autoDismiss: true,
      });
      setLoadingSubmit(false);
      props.onHide();
      setShowEdit(false);
    } catch (error) {
      console.log(error);
    }
  };
  const clickCancel = () => {
    setReviewContent(initialReviewContent);
    setShowEdit(false);
  };
  useEffect(() => {
    if (props.orderId && props.show) {
      fecthOrder();
    }
  }, [props.orderId, props.show]);
  useEffect(() => {
    if (!props.show && showEdit) {
      setShowEdit(false);
    }
  }, [props.show]);

  const handleReviewChange = (name, value) => {
    setReviewContent((prevReviewContent) => ({
      ...prevReviewContent,
      [name]: value,
    }));
  };
  return !order ? (
    ""
  ) : (
    <Fragment>
      <Modal
        show={props.show}
        onHide={props.onHide}
        className="product-quickview-modal-wrapper"
      >
        <Modal.Header closeButton></Modal.Header>
        <div
          className="modal-body"
          style={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          <div className="row">
            <div className="col-lg-12 col-md-7">
              {order.map((detail) => {
                const existingReview = detail.product.reviews.find(
                  (item) => item.orderId === props.orderId
                );
                return (
                  <div className="product-rating-review" key={detail.productId}>
                    <div className="product-thumbnail">
                      <img
                        className="img-fluid"
                        src={detail.product.images[0]}
                        alt=""
                      />
                      <div>{detail.product.name}</div>
                    </div>
                    <div className="rating-area">
                      <ProductRating
                        ratingValue={
                          selectedProduct === detail.productId
                            ? reviewContent.ratingValue
                            : existingReview
                            ? existingReview.ratingValue
                            : 0
                        }
                        onChange={(value) =>
                          handleReviewChange("ratingValue", value)
                        }
                        editable={
                          showEdit && selectedProduct === detail.productId
                        }
                      />
                      <div className="mt-3">Rate this product</div>
                    </div>
                    <div className="review-area">
                      <div className="review-header">
                        <span>Write a review</span>
                        <div className="edit-review-btn">
                          {showEdit && detail.productId === selectedProduct ? (
                            <>
                              <button onClick={clickCancel}>Cancel</button>
                              <button
                                className="edit-save-btn"
                                onClick={() => clickSave(detail.productId)}
                              >
                                {loadingSubmit ? (
                                  <div className="loading-send">
                                    <span
                                      className="spinner-border spinner-border-sm"
                                      role="status"
                                      aria-hidden="true"
                                    ></span>
                                    Save
                                  </div>
                                ) : (
                                  "Save"
                                )}
                              </button>
                            </>
                          ) : (
                            <button
                              className="edit-save-btn"
                              onClick={() => clickEdit(detail.productId)}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                      {showEdit && detail.productId === selectedProduct ? (
                        <textarea
                          placeholder={t("detail.message")}
                          value={reviewContent.content}
                          onChange={(e) =>
                            handleReviewChange("content", e.target.value)
                          }
                        />
                      ) : (
                        <div>
                          {
                            detail.product.reviews.find(
                              (item) => item.orderId === props.orderId
                            )?.content
                          }
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};
EditReview.propTypes = {
  onHide: PropTypes.func,
  show: PropTypes.bool,
  orderId: PropTypes.string,
  //   product: PropTypes.object,
};
export default EditReview;
