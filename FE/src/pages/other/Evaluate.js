import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { connect } from "react-redux";


const Evaluate = (props) =>{
    const {t} = useTranslation(['orders','breadcrumb']);
    const [order, setOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    
    useEffect(() => {
            //fetchData();
            getAllOrders();
    }, []);
    const getAllOrders = async () => {
        try {
            const response = await axiosInstance.get("/api/v1/orders");
            setOrders(response.data);
            console.log("orders", orders);
        } catch (error) {
        console.log("Fail to load my orders");
        }
    };

    return(
        <Fragment>
            <Modal
                show={props.show}
                onHide={props.onHide}
                className="product-quickview-modal-wrapper"
            >
                <Modal.Header closeButton></Modal.Header>

            </Modal>
            {/* <div className="modal-body">
                <div>
                <div className="row mt-4">
                    <div className="col-lg-12">
                    <div className="table-content table-responsive cart-table-content">
                        <table>
                        <thead>
                            <tr>
                            <th>{t('detail.img')}</th>
                            <th>{t('detail.product-name')}</th>
                            <th>{t('detail.unit-price')}</th>
                            <th>{t('detail.qty')}</th>
                            <th>{t('detail.subtotal')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.details.map((detail) => (
                            <tr key={detail.productId}>
                                <td className="product-thumbnail">
                                <img
                                    className="img-fluid"
                                    src={detail.product.images[0]}
                                    alt=""
                                />
                                </td>
                                <td className="product-name text-center">
                                {detail.product.name}
                                </td>
                                <td className="product-price-cart">
                                <span className="amount">
                                    {detail.product.price.toLocaleString("vi-VN")}₫
                                </span>
                                </td>
                                <td className="product-quantity text-center">
                                x{detail.quantity}
                                </td>
                                <td className="product-subtotal">
                                {detail.subtotal.toLocaleString("vi-VN")}₫
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>
            </div>

            </div> */}
            
        </Fragment>
    )
}
Evaluate.propTypes = {
//   addtoast: PropTypes.func,
//   addtocart: PropTypes.func,
//   addtocompare: PropTypes.func,
//   addtowishlist: PropTypes.func,
//   cartitems: PropTypes.array,
//   compareitem: PropTypes.object,
//   currency: PropTypes.object,
//   discountedprice: PropTypes.number,
//   finaldiscountedprice: PropTypes.number,
//   finalproductprice: PropTypes.number,
//   onHide: PropTypes.func,
//   product: PropTypes.object,
//   show: PropTypes.bool,
//   wishlistitem: PropTypes.object,
};
export default Evaluate;