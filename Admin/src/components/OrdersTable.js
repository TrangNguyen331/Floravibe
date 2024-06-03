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
import { DownIcon, SortDefaultIcon, UpIcon } from "../icons";
import moment from 'moment';

function Icon({ icon, ...props }) {
  const Icon = icon;
  return <Icon {...props} />;
}

const OrdersTable = ({ resultsPerPage, filter, searchType, searchValue, refresh}) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [totalResults, setTotalResult] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [sortType, setSortType] = useState("default");
  const [sortTotalType, setSortTotalType] = useState("default");
  const [sortStatusType, setSortStatusType] = useState("default");
  const [sortDateType, setSortDateType] = useState("default");

  const statusOptions = [
    { value: "IN_REQUEST", label: "In Request", color: "p-2 rounded-md bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100 mb-2 mt-2"},
    { value: "IN_PROCESSING", label: "In Processing", color: "p-2 rounded-md bg-pink-100 text-pink-700 dark:bg-pink-700 dark:text-pink-100 mb-2 mt-2" },
    { value: "CANCEL", label: "Cancel", color: "p-2 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-100 mb-2 mt-2" },
    { value: "COMPLETED", label: "Completed", color: "p-2 rounded-md bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 mb-2 mt-2" },
  ];
  // pagination change control
  // async function onPageChange(p) {
  //   await fetchData(p, filter, resultsPerPage);
  // }
  
  async function onPageChange(p) {
    setPage(p);
    setData(ordersData.slice((p - 1) * resultsPerPage, p * resultsPerPage));
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
  const fetchAllOrdersData = async () => {
    try {
      const response = await axiosInstance.get('/api/v1/orders/paging?page=0&size=999');
      const sortedOrdersData = response.data.content.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setOrdersData(sortedOrdersData); // You might want to save this data elsewhere or process it as needed.
      setDataLoaded(true);
    } catch (error) {
      console.log("Fetch data error", error);
    }
  };

  useEffect(() => {
    fetchData(1, filter, resultsPerPage);
    fetchAllOrdersData();
  }, [resultsPerPage, filter]);

  useEffect(() => {
    setData(ordersData.slice((page - 1) * resultsPerPage, page * resultsPerPage));
  }, [ordersData, page, resultsPerPage]); 

  //Sort Client
  const handleSort = () => {
    let sortedData = [...ordersData];
    if (sortType === "default") {
      sortedData.sort((a, b) => a.additionalOrder.fullName.localeCompare(b.additionalOrder.fullName));
      setSortType('asc');
    } else if (sortType === 'asc') {
      sortedData.sort((a, b) => b.additionalOrder.fullName.localeCompare(a.additionalOrder.fullName));
      setSortType('desc');
    } else if (sortType === 'desc') {
      // fetchData(page, filter, resultsPerPage);
      fetchAllOrdersData();
      setSortType('default');
    }
    setOrdersData(sortedData);
    let displayedData = sortedData.slice((page-1)*resultsPerPage, page*resultsPerPage);
    setData(displayedData);
  }

  // Sort Total
  const handleSortTotal = () => {
    let sortedData = [...ordersData];
    if (sortTotalType === 'default') {
        sortedData.sort((a, b) => a.total - b.total);
        setSortTotalType('asc');
    } else if (sortTotalType === 'asc') {
        sortedData.sort((a, b) => b.total - a.total);
        setSortTotalType('desc');
    } else if (sortTotalType === 'desc') {
        fetchAllOrdersData();
        setSortTotalType('default');
    }
    setOrdersData(sortedData);
    let displayedData = sortedData.slice((page - 1) * resultsPerPage, page * resultsPerPage);
    setData(displayedData);
  }
  

  const handleSortStatus = () => {
    let sortedData = [...ordersData];
    if (sortStatusType === 'default') {
      sortedData.sort((a, b) => a.status.localeCompare(b.status));
      setSortStatusType('asc');
    } else if (sortStatusType === 'asc') {
      sortedData.sort((a, b) => b.status.localeCompare(a.status));
      setSortStatusType('desc');
    } else if (sortStatusType === 'desc') {
      fetchAllOrdersData();
      setSortStatusType('default');
    }
    setOrdersData(sortedData);
    let displayedData = sortedData.slice((page - 1) * resultsPerPage, page * resultsPerPage);
    setData(displayedData);
  }

  const handleSortDate = () => {
    let sortedData = [...ordersData];
    if (sortDateType === 'default') {
      sortedData.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
      setSortDateType('asc');
    } else if (sortDateType === 'asc') {
      sortedData.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setSortDateType('desc');
    } else if (sortDateType === 'desc') {
      fetchAllOrdersData();
      setSortDateType('default');
    }
    setOrdersData(sortedData);
    let displayedData = sortedData.slice((page - 1) * resultsPerPage, page * resultsPerPage);
    setData(displayedData);
  }
  useEffect(() => {
    let filteredData = [...ordersData];
    switch (searchType) {
      case 'Client':
        filteredData = ordersData.filter(order => 
          order.additionalOrder.fullName.toLowerCase().includes(searchValue.toLowerCase())
        );
        break;
      case 'Order ID':
        filteredData = ordersData.filter(order => 
          order.id.includes(searchValue)
        );
        break;
      case 'Name Of Product':
        filteredData = ordersData.filter(order => 
          order.details && order.details.some(detail => 
            detail.product.name.toLowerCase().includes(searchValue.toLowerCase())
          )
        );
        break;
      case 'Price':
        filteredData = ordersData.filter(order =>
          order.total === Number(searchValue)
        );
        break;
      case 'Date':
        filteredData = ordersData.filter(order => {
          const inputDate = new Date(searchValue);
          inputDate.setHours(0, 0, 0, 0);
          const orderDate = new Date(order.createdDate);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === inputDate.getTime();
        });
        break;
      default:
        filteredData = [...ordersData];
    }
    setTotalResult(filteredData.length);
    setData(filteredData.slice((page - 1) * resultsPerPage, page * resultsPerPage));
  }, [searchType, searchValue, page, refresh]);

  return (
    <div>
      {/* Table */}
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>
                <div className="flex items-center"> 
                  Client
                  <div onClick={handleSort} className="cursor-pointer">
                    <Icon 
                      className="w-3 h-3 ml-2 text-purple-600 hover:text-red-500" 
                      aria-hidden="true" 
                      icon={
                        sortType === 'asc'
                          ? UpIcon
                          : sortType === 'desc'
                          ? DownIcon
                          : SortDefaultIcon
                      }
                    />
                  </div>
                </div>
              </TableCell> 
              <TableCell>Order ID</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>
                <div className="flex items-center"> 
                  Total
                  <div onClick={handleSortTotal} className="cursor-pointer">
                    <Icon 
                      className="w-3 h-3 ml-2 text-purple-600 hover:text-red-500" 
                      aria-hidden="true" 
                      icon={
                        sortTotalType === 'asc'
                          ? UpIcon
                          : sortTotalType === 'desc'
                          ? DownIcon
                          : SortDefaultIcon
                      }
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center"> 
                  Status
                  <div onClick={handleSortStatus} className="cursor-pointer">
                    <Icon 
                      className="w-3 h-3 ml-2 text-purple-600 hover:text-red-500" 
                      aria-hidden="true" 
                      icon={
                        sortStatusType === 'asc'
                          ? UpIcon
                          : sortStatusType === 'desc'
                          ? DownIcon
                          : SortDefaultIcon
                      }
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center"> 
                  Date
                  <div onClick={handleSortDate} className="cursor-pointer">
                    <Icon 
                      className="w-3 h-3 ml-2 text-purple-600 hover:text-red-500" 
                      aria-hidden="true" 
                      icon={
                        sortDateType === 'asc'
                          ? UpIcon
                          : sortDateType === 'desc'
                          ? DownIcon
                          : SortDefaultIcon
                      }
                    />
                  </div>
                </div>
              </TableCell>
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
                            font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100 mb-2 mt-2"
                          >
                            {detail.product.name} x {detail.quantity}
                          </span>
                        </div>
                      ))
                    : ""}
                </TableCell>
                <TableCell>
                  <span className="text-base">
                    {order.total.toLocaleString("vi-VN") || ""} ₫
                  </span>
                </TableCell>
                <TableCell>
                  <select
                    className={`form-control ${statusOptions.find(
                      (option) => option.value === order.status
                    ).color}`}
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(e.target.value, order.id)
                    }
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
                </TableCell>
                <TableCell>
                  <span className="text-base">
                    {new Date(order.createdDate).toLocaleDateString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {searchValue && data.length === 0 && 
              <p className="text-center my-4 text-purple-500">No result match</p>}
          </TableBody>
        </Table>
        <TableFooter>
          {dataLoaded &&  (
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
