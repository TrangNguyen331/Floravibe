import React from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { MetaTags } from "react-meta-tags";
import LayoutOne from "../../layouts/LayoutOne";
import "../../assets/scss/_policy.scss";
import { Col, Row } from "reactstrap";
import { useTranslation } from "react-i18next";

const Policy = () => {
  const { t } = useTranslation(["breadcrumb"]);
  return (
    <div>
      <MetaTags>
        <title>Floravibe | {t("policy")}</title>
        <meta name="Our Policy" content="Policy Page" />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {t("home")}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/policy"}>
        {t("policy")}
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        <Breadcrumb>
          <BreadcrumbsItem>
            <a href={process.env.PUBLIC_URL + "/"}>Home</a>
          </BreadcrumbsItem>
          <BreadcrumbsItem active>Our Policy</BreadcrumbsItem>
        </Breadcrumb>
        <section className="container">
          <div className="first_section">
            <Row>
              <Col lg="4" md="4">
                <h3 className="first_title">ĐỔI/TRẢ HÀNG</h3>
              </Col>
              <Col lg="8" md="8">
                <p>
                  Thời gian nhận đổi hoặc trả là 1-2 ngày kể từ ngày nhận hàng.
                </p>
                <p>
                  Khách hàng cần xem xét kỹ trước khi quyết định đặt mua. Chúng
                  tôi chỉ nhận lại sản phẩm khi sản phẩm đó không đúng với miêu
                  tả trên trang web của chúng tôi và không đúng với yêu cầu
                  trong đơn đặt mua hàng của khách hàng. Trong trường hợp này,
                  khách hàng sẽ được nhận lại 100% số tiền.
                </p>
                <p>
                  Chúng tôi giữ quyền từ chối yêu cầu đổi hoặc trả hàng đối với
                  các lỗi không phải do chúng tôi gây ra và nếu sản phẩm bị
                  thiếu tag, bẩn, gãy, hỏng hoặc bất kỳ tổn hại nào khác do lỗi
                  của khách hàng.
                </p>
              </Col>
            </Row>
          </div>

          <div className="first_section">
            <Row>
              <Col lg="4" md="4">
                <h3 className="first_title">HOÀN TIỀN</h3>
              </Col>
              <Col lg="8" md="8">
                <p>
                  Thời hạn hoàn trả tiền chậm nhất là 5 ngày kể từ ngày nhận
                  được trả lời chính thức của chúng tôi. Khách hàng có thể chọn
                  nhận lại tiền qua chuyển khoản hoặc trả tiền mặt.
                </p>
                <p>
                  Nếu xảy ra chênh lệch giá trong trường hợp đổi hàng, chúng tôi
                  sẽ liên hệ với bạn qua điện thoại
                </p>
              </Col>
            </Row>
          </div>

          <div className="first_section">
            <Row>
              <Col lg="4" md="4">
                <h3 className="first_title">THỜI GIAN GIAO</h3>
              </Col>
              <Col lg="8" md="8">
                <p>
                  Đối với các đơn hàng trong khu vực thành phố Hồ Chí Minh,
                  chúng tôi cung cấp dịch vụ giao hàng miễn phí và giao hàng
                  nhanh chóng trong vòng 60 phút kể từ khi xác nhận đơn hàng.
                </p>
                <p>
                  Do điều kiện thời tiết hoặc các yếu tố khách quan khác, đôi
                  khi có thể xảy ra trì hoãn trong quá trình giao hàng. Chúng
                  tôi sẽ cố gắng thông báo và điều chỉnh thời gian giao hàng một
                  cách linh hoạt để đảm bảo sự thuận tiện cho quý khách hàng.
                </p>
              </Col>
            </Row>
          </div>
        </section>
      </LayoutOne>
    </div>
  );
};

export default Policy;
