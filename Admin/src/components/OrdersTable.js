import React, { useState, useEffect } from "react";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Dropdown,
  Select,
} from "@windmill/react-ui";
import response from "../utils/demo/ordersData";
import axiosInstance from "../axiosInstance";

const OrdersTable = ({ resultsPerPage, filter }) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [totalResults, setTotalResult] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const statusOptions = [
    { value: "IN_REQUEST", label: "In Request", type: "danger" },
    { value: "IN_PROCESSING", label: "In Processing", type: "danger" },
    { value: "CANCEL", label: "Cancel", type: "danger" },
    { value: "COMPLETED", label: "Completed", type: "success" },
  ];
  // pagination change control
  async function onPageChange(p) {
    await fetchData(p, filter, resultsPerPage);
  }
  const handleStatusChange = async (status, orderId) => {
    try {
      let item = data.filter((x) => x.id === orderId)[0];
      item.status = status;
      await axiosInstance.put(`/api/v1/orders/${item.id}`, item);
      await fetchData(page, filter, resultsPerPage);
    } catch (error) {
      console.log("Update status fail");
    }
  };

  const fetchData = async (page, filter, resultsPerPage) => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/orders/paging?page=${
          page - 1
        }&size=${resultsPerPage}&search=${filter}`
      );
      const sortedData = response.data.content.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setData(sortedData);
      setPage(page);
      setTotalPage(response.data.totalPages);
      setTotalResult(response.data.totalElements);
      setDataLoaded(true);
    } catch (error) {
      console.log("Fetch data error", error);
    }
  };

  useEffect(() => {
    fetchData(1, filter, resultsPerPage);
  }, [resultsPerPage, filter]);
  return (
    <div>
      {/* Table */}
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Client</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((order, i) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">
                        {order.additionalOrder.fullName}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-base">{order.id || ""}</span>
                </TableCell>
                <TableCell className="text-base">
                  {order && order.details && order.details.length > 0
                    ? order.details.map((detail) => (
                        <div key={detail.productId} className="flex">
                          <span
                            className="px-2 inline-flex text-xs leading-5
                      font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 mb-2 mt-2"
                          >
                            {detail.product.name} X {detail.quantity}
                          </span>
                        </div>
                      ))
                    : ""}
                </TableCell>
                <TableCell>
                  <span className="text-base">
                    {order.total.toLocaleString("vi-VN") || ""} đ
                  </span>
                </TableCell>
                <TableCell>
                  <select
                    className="form-control"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(e.target.value, order.id)
                    }
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell>
                  <span className="text-base">
                    {new Date(order.createdDate).toLocaleDateString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          {dataLoaded && (
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              label="Table navigation"
              onChange={onPageChange}
            />
          )}
        </TableFooter>
      </TableContainer>
    </div>
  );
};

export default OrdersTable;
