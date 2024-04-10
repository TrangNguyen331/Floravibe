import React from "react";
import "../../assets/scss/_banner-voucher.scss";
import {Container, Col, Row} from "reactstrap";


const BannerVoucher = () => {
    //const backgroundImgUrl = 'https://lh3.googleusercontent.com/drive-viewer/AKGpihYZDAu8ksjURC5Md6OlUYUsP2-8KLDizCjW8DvDcsoprD6vOsTZdyWJlFGr6oT1ii5AIdFMc8OD5DKlBg2ytrVGEVGtVlQ2oCM=s1600-rw-v1'

    return (
        <div>
            <div className="container">
                <Container>
                    <Row>
                    <Col lg="5" md="5">
                        <div className="parent-background" >
                            <div className="child-background">
                                <Row>
                                    <Col className="info-voucher" lg="7" md="7">
                                        <div className="voucher">
                                            Voucher
                                        </div>
                                        <div className="valid">
                                            <span className="number">
                                                100.000
                                            </span>
                                            <span className="currency">
                                                VND
                                            </span>
                                        </div>
                                        <div className="due-date">
                                            <i class="ri-hourglass-fill"></i>Due date: 
                                        </div>
                                        <div className="first-content">
                                            Applicable to invoices from <br/>1.000.000
                                        </div>
                                    </Col>
                                    <Col className="info-code-voucher" lg="5" md="5">
                                        <div className="second-content">
                                            Applies to all invoices in the shop
                                        </div>
                                        <div className="text-enter-code">
                                            <span>Enter code</span>
                                        </div>
                                        <div className="code">
                                            Abc1234567890
                                        </div>
                                        <div>
                                            AT CHECKOUT
                                        </div>
                                        <div className="quantity">
                                            Quantity:
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                    <Col lg="5" md="5">
                        
                    </Col>
                    </Row>
                </Container>
            </div>
        </div>
        
    )
}

export default BannerVoucher;