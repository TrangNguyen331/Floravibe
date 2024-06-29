import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
const CancelVnpay = (props) => {
  const { t } = useTranslation(["notify"]);
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
          <Modal.Title>{t("order-cancel-notice")}</Modal.Title>
        </Modal.Header>
        <div className="modal-body">
          <div className="content-container">
            <div className="row">
              <div className="col-12">
                <div className="icon-speaker">
                  <i className="pe-7s-speaker" />
                </div>
                <h3 className="text-center">{t("cancel-success")}</h3>
                <p>Dear Customer,</p>
                <p>
                  Since you had already paid for this order, we will contact you
                  shortly to confirm the cancellation. After that, we will
                  process your refund as soon as possible. Please note that the
                  refund process may take up to 3-5 business days to complete.
                </p>
                <p>
                  Please be ready to provide any additional information if
                  required.
                </p>
                <p>Thank you for your understanding and patience.</p>
                <p>Best regards,</p>
                <p>Floravibe</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};
CancelVnpay.propTypes = {
  onHide: PropTypes.func,
  show: PropTypes.bool,
};
export default CancelVnpay;
