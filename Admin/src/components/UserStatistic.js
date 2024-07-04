import {
  TableHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow,
  Avatar,
} from "@windmill/react-ui";
import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import Paginate from "./Pagination/Paginate";
import {
  CheckBox,
  LockOpenOutlined,
  LockPerson,
  LockPersonOutlined,
} from "@mui/icons-material";
import { Box, LinearProgress } from "@mui/material";
import { green } from "@mui/material/colors";

const UserStatistic = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPage] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [totalResults, setTotalResult] = useState(0);
  const [loadingGet, setLoadingGet] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState([]);

  const onPageChange = async (e, p) => {
    await fetchData(p);
  };

  const fetchData = async (page) => {
    try {
      setLoadingGet(true);
      const response = await axiosInstance.get("/api/v1/customerStats/all");

      setData(response.data);
      const totalPage = Math.ceil(response.data.length / resultsPerPage);
      setTotalPage(totalPage);
      setTotalResult(response.data.length);
      setData(
        response.data.slice((page - 1) * resultsPerPage, page * resultsPerPage)
      );
      setPage(page);
      setDataLoaded(true);
      setLoadingGet(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData(1);
  }, []);

  return (
    <div>
      {loadingGet ? (
        <Box
          sx={{ width: "100%", color: "grey.500", backgroundColor: "grey.500" }}
        >
          <LinearProgress
            sx={{
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#edebfe", // Customize bar color
              },
              backgroundColor: "#7e3af2", // Customize background color
            }}
          />
        </Box>
      ) : (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader className="text-center">
              <tr>
                <TableCell>Username</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Number of times cancelled</TableCell>
                <TableCell>Status</TableCell>
              </tr>
            </TableHeader>
            <TableBody className="text-center">
              {data.map((user, index) => (
                <TableRow
                  key={index}
                  className="transition-colors duration-200"
                >
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Avatar
                        className="hidden mr-4 md:block"
                        src={
                          user.customerAvatar
                            ? user.customerAvatar
                            : "https://i.pinimg.com/originals/90/48/9f/90489fda05254bb2fef245248e9befb1.jpg"
                        }
                        alt="User avatar"
                      />
                      <div>
                        <p className="font-semibold">{user.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {user.firstName ? user.firstName : "Unknown"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {user.lastName ? user.lastName : "Unknown"}
                  </TableCell>
                  <TableCell className="text-sm">{user.email}</TableCell>
                  <TableCell className="text-sm">{user.cancelTimes}</TableCell>
                  <TableCell className="text-sm">
                    {user.active ? (
                      <LockOpenOutlined style={{ color: "green" }} />
                    ) : (
                      <LockPersonOutlined style={{ color: "red" }} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooter>
            {dataLoaded && (
              <Paginate
                totalPages={totalPages}
                totalResults={totalResults}
                page={page}
                onPageChange={onPageChange}
              />
            )}
          </TableFooter>
        </TableContainer>
      )}
    </div>
  );
};

export default UserStatistic;
