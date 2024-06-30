import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { DashboardIcon, Info } from "../icons";
import { Card, CardBody, Badge, TableHeader, Avatar } from "@windmill/react-ui";
import { genRating } from "../utils/genarateRating";
import ReasonCancel from "../components/ReasonCancel";
import axiosInstance from "../axiosInstance";
import {
  InfoOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  StarBorder,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Divider,
  IconButton,
  Paper,
  Popover,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";

const SingleOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [open, setOpen] = useState({});
  const [cancelOrder, setCancelOrder] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
  });
  const statusOptions = [
    {
      value: "IN_REQUEST",
      label: "IN REQUEST",
      color:
        "px-5 py-4 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100",
    },
    {
      value: "IN_PROCESSING",
      label: "IN PROGRESS",
      color:
        "px-4 py-4 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-700 dark:text-pink-100",
    },
    {
      value: "CANCEL",
      label: "CANCELLED",
      color:
        "px-5 py-3 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100",
    },
    {
      value: "COMPLETED",
      label: "COMPLETED",
      color:
        "px-5 py-3 rounded-full bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100",
    },
  ];
  const getStatusOption = (statusValue) => {
    return statusOptions.find((option) => option.value === statusValue);
  };

  const toggleOpen = (index) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [index]: !prevOpen[index],
    }));
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
  function formatNumberWithDecimal(number) {
    const numString = String(number); // Convert the number to a string
    const groups = numString.split(/(?=(?:\d{3})+(?!\d))/); // Split the string into groups of three digits
    const formattedNumber = groups.join("."); // Join the groups with a decimal point
    return formattedNumber;
  }

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/orders/" + id);
      setOrder(response.data);
    } catch (error) {}
  };

  // const handleStatusChange = async (event) => {
  //   const newStatus = event.target.value;
  //   try {
  //     const updatedOrder = { ...order, status: newStatus };
  //     await axiosInstance.put(`/api/v1/orders/${id}`, updatedOrder);
  //     setOrder(updatedOrder);
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Update status failed:", error);
  //   }
  // };
  const closeModal = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsCancelModalOpen(false);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      if (newStatus === "CANCEL") {
        setIsCancelModalOpen(true);
      } else {
        order.status = newStatus;
        console.log(order);

        const updatedOrder = { ...order, status: newStatus };
        await axiosInstance.put(`/api/v1/orders/${id}`, order);
        setOrder(updatedOrder);
        window.location.reload();
      }
    } catch (error) {
      console.log("Update status fail:", error);
    }
    //  try {
    //    // Tìm item tương ứng với orderId
    //    let updatedData = order.map((item) => {
    //        if (newStatus === "CANCEL") {
    //          setCancelOrder(id);
    //          setIsCancelModalOpen(true);
    //        } else {
    //          item.status = newStatus;
    //          console.log(item);

    //          axiosInstance
    //            .put(`/api/v1/orders/${item.id}`, item)
    //            .then(() => {
    //              setData(updatedData);
    //              fetchData(page, filter, resultsPerPage);
    //            })
    //            .catch((error) => {
    //              console.log("Update status failed:", error);
    //            });
    //        }
    //      return item;
    //    });

    //    setData(updatedData); // Cập nhật lại state data sau khi thay đổi
    //  } catch (error) {
    //    console.log("Update status fail:", error);
    //  }
  };
  useEffect(() => {
    const setDataInit = async () => {
      if (token) {
        const response = await axiosInstance.get("/api/v1/auth/identity");
        setUserInfo({
          // ...userInfo,
          fullName: response.data.fullName || "",
          email: response.data.email || "",
        });
      }
    };
    setDataInit();
  }, []);
  const fetchPaymentData = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/payments/allPayments");
      const paymentForOrder = response.data.find(
        (payment) => payment.orderId === id
      );
      setPayment(paymentForOrder);
      console.log("Payment");
      console.log(paymentForOrder);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
    fetchPaymentData();
  }, []);
  console.log("order", order);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const openPop = Boolean(anchorEl);

  return (
    <div>
      <PageTitle>Order Details</PageTitle>
      {order ? (
        <div>
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
            <NavLink exact to="/app/orders" className="mx-2 text-purple-600">
              All Orders
            </NavLink>
            {">"}
            <p className="mx-2">{order.id}</p>
          </div>

          <Card className="my-8 shadow-md">
            <CardBody>
              <div className="p-4">
                <div className="flex items-center justify-between py-5">
                  <h3>Order {order.id}</h3>
                  <div>
                    {order.status === "COMPLETED" ||
                    order.status === "CANCEL" ? (
                      <span
                        className={getStatusOption(order.status)?.color || ""}
                      >
                        {getStatusOption(order.status)?.label || ""}
                      </span>
                    ) : (
                      <select
                        className={`form-control ${
                          statusOptions.find(
                            (option) => option.value === order.status
                          ).color
                        } w-auto`}
                        value={order.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                      >
                        {statusOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            className={option.color}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  {/* <span className={getStatusOption(order.status)?.color || ""}>
                    {getStatusOption(order.status)?.label || ""}
                  </span> */}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge
                      className="py-1 px-2 gap-2 text-sm leading-5
                            font-semibold rounded-full bg-purple-100 text-purple-900 dark:bg-purple-700 dark:text-purple-100"
                      type="neutral"
                    >
                      Order time:
                      <span className="font-normal">
                        {new Date(order.createdDate).toLocaleString("vi-VN")}
                      </span>
                    </Badge>
                    {order.status === "CANCEL" && order.cancelDetail && (
                      <Badge
                        className="py-1 px-2 gap-2 text-sm leading-5
                            font-semibold rounded-full bg-purple-100 text-purple-900 dark:bg-purple-700 dark:text-purple-100"
                        type="neutral"
                      >
                        Cancel time:
                        <span className="font-normal">
                          {/* {new Date(order.cancelDate).toLocaleString("vi-VN")} */}
                          {new Date(
                            order.cancelDetail.cancelDate
                          ).toLocaleString("vi-VN")}
                        </span>
                      </Badge>
                    )}
                    {order.status === "COMPLETED" && (
                      <Badge
                        className=" py-1 px-2 gap-2 text-sm leading-5
                            font-semibold rounded-full bg-purple-100 text-purple-900 dark:bg-purple-700 dark:text-purple-100"
                        type="success"
                      >
                        Completed time:
                        <span className="font-normal">
                          {new Date(order.completedDate).toLocaleString(
                            "vi-VN"
                          )}
                        </span>
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">
                      {order.status === "CANCEL"
                        ? order.cancelDetail &&
                          order.cancelDetail.cancelRole === "ADMIN"
                          ? "Cancelled by Admin:" + " " + userInfo.email
                          : "Cancelled by customer"
                        : ""}
                    </span>
                    {order.status === "CANCEL" && order.cancelDetail ? (
                      <div>
                        <InfoOutlined
                          aria-owns={openPop ? "mouse-over-popover" : undefined}
                          aria-haspopup="true"
                          onMouseEnter={handlePopoverOpen}
                          onMouseLeave={handlePopoverClose}
                          className="w-1 h-1 text-purple-600 justify-between align-middle"
                        />
                        <Popover
                          id="mouse-over-popover"
                          sx={{
                            pointerEvents: "none",
                          }}
                          open={openPop}
                          anchorEl={anchorEl}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                          onClose={handlePopoverClose}
                          disableRestoreFocus
                        >
                          <Typography sx={{ p: 1 }}>
                            Order has been cancelled because:
                          </Typography>
                          <Typography
                            sx={{
                              paddingLeft: 1,
                              paddingRight: 1,
                              paddingBottom: 1,
                              color: "#7e3af2",
                            }}
                          >
                            {order.cancelDetail.cancelReason}
                          </Typography>
                        </Popover>
                      </div>
                    ) : (
                      ""
                    )}

                    {/* <LightTooltip title="Order has been cancelled because:">
                      <InfoOutlined className="w-1 h-1 text-purple-600 justify-between align-middle" />
                    </LightTooltip> */}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
            <Card className="shadow-md md:col-span-1">
              <CardBody>
                {/* Divider */}
                {/* <hr className="mx-3 my-2 customeDivider" /> */}
                <div className="p-4">
                  <h2 className="mb-4">Customer & Order</h2>
                  <ul>
                    <li className="mb-2 flex justify-between">
                      <span>Name:</span>
                      <span>{order.additionalOrder.fullName}</span>
                    </li>
                    <li className="mb-2 flex justify-between">
                      <span>Email:</span>
                      <span>{order.additionalOrder.email}</span>
                    </li>
                    <li className="mb-2 flex justify-between">
                      <span>Phone:</span>
                      <span>{order.additionalOrder.phone}</span>
                    </li>
                    {/* {order.firstDiscount && order.firstDiscount > 0 ? (
                      <li className="mb-2 flex justify-between">
                        <span>First order:</span>
                        <span>
                          {"-" + order.firstDiscount.toLocaleString("vi-VN")} {""} ₫
                        </span>
                      </li>
                    ) : null} */}
                    <li className="mb-2 flex justify-between">
                      <span>Delivery date:</span>
                      <span>
                        {new Date(order.deliveryDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </li>
                    <li className="mb-2 flex justify-between">
                      <span>Delivery time:</span>
                      <span>{order.deliveryTime}</span>
                    </li>
                    <li className="mb-2 flex justify-between">
                      <span>Payment status:</span>
                      <Badge
                        className="px-3"
                        style={{ fontSize: "15px" }}
                        type={payment && payment.paid ? "success" : "danger"}
                      >
                        {payment && payment.paid ? "Paid" : "Unpaid"}
                      </Badge>
                    </li>
                    <li className="mb-2 flex justify-between">
                      <span>Payment method:</span>
                      <span>{order.methodPaid}</span>
                    </li>
                  </ul>
                </div>
              </CardBody>
            </Card>
            <Card className="shadow-md md:col-span-1">
              <CardBody>
                {/* Divider */}
                {/* <hr className="mx-3 my-2 customeDivider" /> */}
                <div className="p-4">
                  <h2 className="mb-4">Shipping Address</h2>
                  <div className="mb-4">
                    {order.additionalOrder.houseNumber},{" "}
                    {order.additionalOrder.ward},{" "}
                    {order.additionalOrder.district},{" "}
                    {order.additionalOrder.city}
                  </div>
                  {order.additionalOrder.additionalInformation && (
                    <>
                      <Divider className="my-4 mx-4" variant="middle" />
                      <div className="mt-4">
                        <span
                          className="mb-4"
                          style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            // color: '#7e3af2'
                          }}
                        >
                          Note
                        </span>
                        <div>
                          <span className="pt-3 pr-3 pb-3">
                            {order.additionalOrder.additionalInformation}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
          <div>
            <Card>
              <CardBody>
                <div className="p-4">
                  <h2 className="mb-4">Products Ordered</h2>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                      <TableHeader>
                        {/* <TableRow>
                          <TableCell align="center" colSpan={3}>
                            DETAILS
                          </TableCell>
                          <TableCell align="right">PRICE</TableCell>
                        </TableRow> */}
                        <TableRow>
                          {/* <TableCell /> */}
                          <TableCell className="ml-4">PRODUCT NAME</TableCell>
                          <TableCell align="center">UNIT PRICE</TableCell>
                          <TableCell align="center">QUANTITY</TableCell>
                          <TableCell align="right">SUM</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.details.map((detail, index) => {
                          const hasReviews = detail.product.reviews.some(
                            (review) =>
                              review.orderId === id && review.ratingValue > 0
                          );
                          return (
                            <React.Fragment key={index}>
                              <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                <TableCell>
                                  <div className="flex">
                                    <div className="mr-3">
                                      {order.rated ? (
                                        hasReviews ? (
                                          <IconButton
                                            aria-label="expand row"
                                            size="small"
                                            onClick={() => toggleOpen(index)}
                                          >
                                            {open[index] ? (
                                              <KeyboardArrowUp />
                                            ) : (
                                              <KeyboardArrowDown />
                                            )}
                                          </IconButton>
                                        ) : (
                                          <IconButton
                                            aria-label="expand row"
                                            size="small"
                                            className="invisible"
                                          >
                                            <KeyboardArrowDown />
                                          </IconButton>
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                    <div className="flex items-center text-sm space-x-2">
                                      <Avatar
                                        className="hidden mr-4 md:block"
                                        src={
                                          detail.product &&
                                          detail.product.images &&
                                          detail.product.images.length > 0
                                            ? detail.product.images[0]
                                            : ""
                                        }
                                        alt="Product image"
                                      />
                                      <div>{detail.product.name}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell align="center">
                                  {formatNumberWithDecimal(detail.unitPrice)} ₫
                                </TableCell>
                                <TableCell align="center">
                                  {detail.quantity}
                                </TableCell>
                                <TableCell align="right">
                                  {formatNumberWithDecimal(detail.subtotal)} ₫
                                </TableCell>
                              </TableRow>
                              {hasReviews && (
                                <TableRow>
                                  <TableCell
                                    style={{ paddingBottom: 0, paddingTop: 0 }}
                                    colSpan={6}
                                  >
                                    <Collapse
                                      in={open[index]}
                                      timeout="auto"
                                      unmountOnExit
                                    >
                                      <Box margin={1}>
                                        <Typography
                                          variant="h6"
                                          gutterBottom
                                          component="div"
                                          style={{ color: "#7e3af2" }}
                                        >
                                          Product Reviews
                                        </Typography>
                                        {detail.product.reviews.map(
                                          (review, i) =>
                                            review.orderId === id &&
                                            review.ratingValue > 0 && (
                                              <div
                                                className="flex py-3"
                                                key={i}
                                              >
                                                <div className="flex">
                                                  <Avatar
                                                    className="hidden mr-3 md:block"
                                                    size="large"
                                                    src={review.account.avatar}
                                                    alt="User image"
                                                  />
                                                </div>
                                                <div className="flex justify-end flex-grow flex-col">
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex items-center justify-content-center">
                                                      <p className="font-medium text-lg text-gray-800 dark:text-gray-300">
                                                        {
                                                          review.account
                                                            .username
                                                        }{" "}
                                                      </p>
                                                      <span className="ml-4 text-sm text-gray-400">
                                                        {new Date(
                                                          review.createDate
                                                        ).toLocaleString(
                                                          "vi-VN"
                                                        )}
                                                      </span>
                                                    </div>
                                                    <div className="flex justify-end">
                                                      {review.ratingValue &&
                                                        review.ratingValue >
                                                          0 && (
                                                          <div className="flex items-center ml-2">
                                                            <Rating
                                                              align="right"
                                                              name="average-rating"
                                                              size="small"
                                                              value={
                                                                review.ratingValue
                                                              }
                                                              precision={0.2}
                                                              emptyIcon={
                                                                <StarBorder
                                                                  className="text-gray-400"
                                                                  style={{
                                                                    fontSize:
                                                                      "18px",
                                                                  }}
                                                                />
                                                              }
                                                              readOnly
                                                            />
                                                          </div>
                                                        )}
                                                    </div>
                                                  </div>
                                                  <div>
                                                    <p className="text-sm mt-2 w-full text-gray-600 dark:text-gray-400">
                                                      {review.content}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            )
                                        )}
                                      </Box>
                                    </Collapse>
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </TableBody>
                      <TableRow sx={{ justifyContent: "flex-end" }}>
                        <TableCell
                          style={{ border: "none", background: "transparent" }}
                        />
                        <TableCell
                          style={{ border: "none", background: "transparent" }}
                        />
                        <TableCell>Subtotal</TableCell>
                        <TableCell colSpan={2} align="right">
                          {formatNumberWithDecimal(
                            order.total +
                              order.voucherDetail.voucherValue +
                              order.firstDiscount
                          )}{" "}
                          ₫{/* {order.unitTotal}₫ */}
                        </TableCell>
                      </TableRow>
                      {order.firstDiscount && order.firstDiscount > 0 ? (
                        <TableRow>
                          <TableCell
                            style={{
                              border: "none",
                              background: "transparent",
                            }}
                          />
                          <TableCell
                            style={{
                              border: "none",
                              background: "transparent",
                            }}
                          />
                          <TableCell>First Order Discount</TableCell>
                          <TableCell colSpan={2} align="right">
                            {"-" +
                              " " +
                              formatNumberWithDecimal(order.firstDiscount)}{" "}
                            ₫
                          </TableCell>
                        </TableRow>
                      ) : null}
                      <TableRow>
                        <TableCell
                          style={{ border: "none", background: "transparent" }}
                        />
                        <TableCell
                          style={{ border: "none", background: "transparent" }}
                        />
                        <TableCell>Voucher</TableCell>
                        <TableCell colSpan={2} align="right">
                          {"-" +
                            " " +
                            formatNumberWithDecimal(
                              order.voucherDetail.voucherValue
                            )}{" "}
                          ₫
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell />
                        <TableCell />
                        <TableCell>Total</TableCell>
                        <TableCell
                          colSpan={2}
                          align="right"
                          style={{
                            color: "#7e3af2",
                            fontWeight: "bold",
                            fontSize: 20,
                          }}
                        >
                          {formatNumberWithDecimal(order.total)} ₫
                        </TableCell>
                      </TableRow>
                    </Table>
                  </TableContainer>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      ) : (
        ""
      )}
      <ReasonCancel
        isModalOpen={isCancelModalOpen}
        onClose={closeModal}
        orderId={id}
        cancelEmail={userInfo.email}
        data={order && order}
        fetchData={fetchData}
      />
    </div>
  );
};

export default SingleOrder;
