import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { useSelector } from "react-redux";
import axiosInstance from "../../axiosInstance";
import { useParams, useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { useTranslation } from "react-i18next";

const ProductDescriptionTab = ({ spaceBottomClass }) => {
  const { id } = useParams();
  const { addToast } = useToasts();
  const history = useHistory();
  const token = useSelector((state) => state.auth.token);
  const [review, setReview] = useState({
    content: "",
  });
  const [product, setProduct] = useState(null);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReview({
      ...review,
      [name]: value,
    });
  };
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

  const submitReview = async (event) => {
    event.preventDefault();
    // Check if the user is logged in
    if (!token) {
      history.push("/login-register");
      return;
    }
    // Check if the textarea is empty
    if (!review.content.trim()) {
      addToast("Review content is required", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }
    try {
      var body = {
        content: review.content,
      };
      await axiosInstance.post("api/v1/products/review/" + id, body);
      setReview({
        ...review,
        content: "",
      });
      addToast("Post review success", {
        appearance: "success",
        autoDismiss: true,
      });
    } catch (error) {
      console.log(error);
      addToast("Fail to post review !!!", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  const getSortedReview = (reviews) => {
    if (!reviews) {
      reviews = [];
    }
    return [...reviews].sort(
      (a, b) => new Date(b.createDate) - new Date(a.createDate)
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/products/" + id);
        setProduct(response.data);
      } catch (error) {}
    };
    fetchData();
  }, [id, review]);
  const { t } = useTranslation(["product"]);

  return (
    <div className={`description-review-area ${spaceBottomClass}`}>
      <div className="container">
        <div className="description-review-wrapper">
          <Tab.Container defaultActiveKey="productReviews">
            <Nav variant="pills" className="description-review-topbar">
              <Nav.Item>
                <Nav.Link eventKey="additionalInfo">
                  {t("detail.add-info")}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="productReviews">
                  {t("detail.reviews")}
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="description-review-bottom">
              <Tab.Pane eventKey="additionalInfo">
                {product ? (
                  <div
                    className="product-anotherinfo-wrapper"
                    dangerouslySetInnerHTML={{
                      __html: product.additionalInformation,
                    }}
                  ></div>
                ) : (
                  ""
                )}
              </Tab.Pane>
              <Tab.Pane eventKey="productReviews">
                <div className="row">
                  <div className="col-lg-7">
                    {getSortedReview(product ? product.reviews : []).map(
                      (review) => (
                        <div className="review-wrapper" key={review.id}>
                          <div className="single-review">
                            <div className="review-img">
                              <img src={review.account.avatar} alt="" />
                            </div>
                            <div className="review-content">
                              <div className="review-top-wrap">
                                <div className="review-left">
                                  <div className="review-name">
                                    <h4>{review.account.username}</h4>
                                    <span>
                                      {formatReadableDate(review.createDate)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="review-bottom">
                                <p>{review.content}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="col-lg-5">
                    <div className="rating-form-wrapper pl-50">
                      <h3>{t("detail.add-review")}</h3>
                      <div className="rating-form">
                        <form onSubmit={submitReview}>
                          <div className="row">
                            <div className="col-md-12">
                              <div className="rating-form-style form-submit">
                                <textarea
                                  name="content"
                                  onChange={handleInputChange}
                                  placeholder={t("detail.message")}
                                  value={review.content}
                                />
                                <input
                                  type="submit"
                                  defaultValue={t("detail.submit")}
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
};

ProductDescriptionTab.propTypes = {
  productFullDesc: PropTypes.string,
  spaceBottomClass: PropTypes.string,
};

export default ProductDescriptionTab;
