import React from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { MetaTags } from "react-meta-tags";
import LayoutOne from "../../layouts/LayoutOne";
import "../../assets/scss/_policy.scss";
import {Container, Col, Row} from "reactstrap";



const Policy = () => {
    return (
        <div>
            <MetaTags>
                <title>Our Policy</title>
                <meta name="Our Policy" content="Policy Page"/>
            </MetaTags>
            <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
            <BreadcrumbsItem to={process.env.PUBLIC_URL + "/policy"}>Our Policy</BreadcrumbsItem>

            <LayoutOne headerTop="visible">
                <Breadcrumb>
                    <BreadcrumbsItem><a href={process.env.PUBLIC_URL + "/"}>Home</a></BreadcrumbsItem>
                    <BreadcrumbsItem active>Our Policy</BreadcrumbsItem>
                </Breadcrumb>
                <section className="container">
                    <div className="first_section">
                        <Row>
                            <Col lg="4" md="4">
                                <h1 className="first_title">
                                Lorem ipsum
                                </h1>
                            </Col>
                            <Col lg="8" md="8">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                            </Col>
                        </Row>
                    </div>
                    
                    <div className="first_section">
                        <Row>
                            <Col lg="4" md="4">
                                <h1 className="first_title">
                                Lorem ipsum
                                </h1>
                            </Col>
                            <Col lg="8" md="8">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                            </Col>
                        </Row>
                    </div>

                    <div className="first_section">
                        <Row>
                            <Col lg="4" md="4">
                                <h1 className="first_title">
                                Lorem ipsum
                                </h1>
                                <h1 className="first_title">
                                Lorem ipsum
                                </h1>
                            </Col>
                            <Col lg="8" md="8">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>
                            </Col>
                        </Row>
                    </div>
                </section>
            </LayoutOne>
                     
        </div>
    )
}

export default Policy;
