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
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";
import { AddIcon } from "../icons";
import axiosInstance from "../axiosInstance";
import { AccountForm } from "./AccountForm";

const UsersTable = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalResults, setTotalResult] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  // pagination setup

  // pagination change control
  async function onPageChange(p) {
    console.log(p);
    await fetchData(p);
  }
  const fetchData = async (page) => {
    try {
      console.log("page", page);
      const response = await axiosInstance.get(
        "/api/v1/auth/paging?page=" + (page - 1) + "&size=" + resultsPerPage
      );
      console.log("Response data", response.data);
      setData(response.data.content);
      setPage(page);
      setTotalPage(response.data.totalPages);
      setTotalResult(response.data.totalElements);
      setDataLoaded(true);
    } catch (error) {
      console.log("Fetch data error", error);
    }
  };

  const handleCheckboxChange = async (userId) => {
    console.log("Handle on change", userId);
    try {
      await axiosInstance.put(`/api/v1/auth/active/${userId}`);
      await fetchData(1);
    } catch (error) {
      console.log("Error", error);
    }
  };
  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    fetchData(1);
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal = async () => {
    setIsModalOpen(true);
  };
  return (
    <div>
      {/* Add */}
      <div className="flex items-center justify-end mt-5 mb-5">
        <div className="flex">
          <Button
            size="large"
            iconLeft={AddIcon}
            className="mx-3"
            onClick={() => openModal()}
          >
            Create account
          </Button>
        </div>
      </div>

      {/* Modal */}
      <div>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalHeader className="flex items-center text-2xl">
            Add New Account
          </ModalHeader>
          <ModalBody>
            <AccountForm />
          </ModalBody>
          <ModalFooter>
            <div className="flex items-center gap-2">
              <Button layout="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button block>Add</Button>
            </div>
          </ModalFooter>
        </Modal>
      </div>

      {/* Table */}
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Active</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-base">
                    <Avatar
                      className="hidden mr-3 md:block"
                      src={
                        user.avatar
                          ? user.avatar
                          : "https://i.pinimg.com/564x/93/4e/37/934e37c613b24b4c7aa236644dd46fdc.jpg"
                      }
                      alt="User image"
                    />
                    <div>
                      <p className="font-semibold">{user.firstName}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-base">{user.lastName}</span>
                </TableCell>
                <TableCell>
                  <span className="text-base">{user.email}</span>
                </TableCell>

                <TableCell className="space-x-2">
                  {user.roles.map((role, index) => (
                    <Badge type="success" key={index}>
                      {role}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell>
                  <Input
                    type="checkbox"
                    checked={user.isActive}
                    onChange={() => handleCheckboxChange(user.id)}
                  />
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
              onChange={(page) => onPageChange(page)}
            />
          )}
        </TableFooter>
      </TableContainer>
    </div>
  );
};

export default UsersTable;
