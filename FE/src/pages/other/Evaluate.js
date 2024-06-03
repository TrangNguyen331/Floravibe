import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";
import axiosInstance from "../../axiosInstance";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import ProductRating from "../../components/product/sub-components/ProductRating";

const Evaluate = (props) => {
  const { t } = useTranslation(['product', 'orders','breadcrumb']);
  const { addToast } = useToasts();
  const [submitData, setSubmitData] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [order, setOrder] = useState(null);
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
  useEffect(() => {
    if (props.orderId) {
      fecthOrder();
    }
  }, [props.orderId]);

  const handleOnChange = (productId, value, type) => {
    setSubmitData((prevData) => {
      const existingReviewIndex = prevData.findIndex(
        (item) => item.productId === productId
      );
      if (existingReviewIndex !== -1) {
        const updatedData = [...prevData];
        if (type === "rating") {
          updatedData[existingReviewIndex].ratingValue = value;
        } else if (type === "review") {
          updatedData[existingReviewIndex].content = value;
        }
        return updatedData;
      } else {
        const newReview = {
          orderId: props.orderId,
          productId,
          content: type === "review" ? value : "",
          ratingValue: type === "rating" ? value : 5,
        };
        return [...prevData, newReview];
      }
    });
  };
  const submitReview = async () => {
    console.log(submitData);
    try {
      setLoadingSubmit(true);
      for (const data of submitData) {
        var body = {
          content: data.content,
          ratingValue: data.ratingValue,
        };
        await axiosInstance.post(
          `api/v1/products/review/${data.productId}/${data.orderId}`,
          body
        );
      }
      props.fetchData();
      addToast("Post review success", {
        appearance: "success",
        autoDismiss: true,
      });
      setLoadingSubmit(false);

      props.onHide();
      setSubmitData([]);
    } catch (error) {
      console.log(error);
      addToast("Fail to post review !!!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
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
              {order.map((detail) => (
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
                        submitData.find(
                          (item) => item.productId === detail.productId
                        )?.ratingValue || 5
                      }
                      onChange={(value) =>
                        handleOnChange(detail.productId, value, "rating")
                      }
                    />
                    <div className="mt-3">Rate this product</div>
                  </div>
                  <div className="review-area">
                    <p>Write a review</p>
                    <textarea
                      name="content"
                      placeholder={t("detail.message")}
                      value={
                        submitData.some(
                          (item) => item.productId === detail.productId
                        )
                          ? submitData.some(
                              (item) => item.productId === detail.productId
                            ).content
                          : ""
                      }
                      onChange={(e) =>
                        handleOnChange(
                          detail.productId,
                          e.target.value,
                          "review"
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Modal.Footer>
          <button
            className="review-rating-btn"
            onClick={submitReview}
            disabled={loadingSubmit}
          >
            {loadingSubmit ? (
              <div className="loading-send">
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Submit
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};
Evaluate.propTypes = {
  onHide: PropTypes.func,
  show: PropTypes.bool,
  orderId: PropTypes.string,
  fetchData: PropTypes.func,
  //   product: PropTypes.object,
};
export default Evaluate;
