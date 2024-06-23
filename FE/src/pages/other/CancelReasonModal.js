import React, { Fragment, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { reasonList } from "../../helpers/helper";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../axiosInstance";
import CancelVnpay from "./CancelVnpay";
const CancelReasonModal = (props) => {
  const [isCancelShow, setCancelShow] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [reason, setReason] = useState("");

  const clickSubmit = async () => {
    setLoadingSubmit(true);
    try {
      let body = {
        cancelEmail: props.email,
        cancelReason: reason,
        cancelRole: "USER",
      };
      await axiosInstance.put(`api/v1/orders/${props.orderId}/cancel`, body);
      setLoadingSubmit(false);
      props.onHide();
      await props.fetchData();

      if (props.methodPaid === "VNPAY") {
        setCancelShow(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Fragment>
      <Modal
        show={props.show}
        onHide={props.onHide}
        keyboard={false}
        backdrop="static"
        className="product-quickview-modal-wrapper"
      >
        <Modal.Header closeButton>
          <Modal.Title>Lý do hủy đơn hàng</Modal.Title>
        </Modal.Header>
        <div className="modal-body">
          <div className="row">
            <div className="col-lg-12 col-md-7">
              <Form.Group>
                <Form.Label>Chọn lý do:</Form.Label>
                <Form.Control
                  as="select"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  {reasonList.map((item) => (
                    <option key={item.key} value={item.value}>
                      {item.value}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </div>
          </div>
        </div>
        <Modal.Footer>
          <button
            className="review-rating-btn"
            onClick={clickSubmit}
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
      <CancelVnpay show={isCancelShow} onHide={() => setCancelShow(false)} />
    </Fragment>
  );
};
CancelReasonModal.propTypes = {
  onHide: PropTypes.func,
  show: PropTypes.bool,
  orderId: PropTypes.string,
  methodPaid: PropTypes.string,
  email: PropTypes.string,
  fetchData: PropTypes.func,
};
export default CancelReasonModal;
