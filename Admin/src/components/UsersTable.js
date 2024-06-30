import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Label,
  Select,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";
import { NavLink } from "react-router-dom";
import Icon from "../components/Icon";
import Paginate from "./Pagination/Paginate";
import {
  AddIcon,
  DashboardIcon,
  RefreshIcon,
  SearchIcon,
  UpIcon,
  DownIcon,
  SortDefaultIcon,
} from "../icons";
import RoundIcon from "./RoundIcon";
import axiosInstance from "../axiosInstance";
import { AccountForm } from "./AccountForm";
import { useToasts } from "react-toast-notifications";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
const UsersTable = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [dataOrg, setDataOrg] = useState([]);
  const [resultsPerPage, setResultPerPage] = useState(10);
  const [totalPages, setTotalPage] = useState(0);
  const [totalResults, setTotalResult] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadingGet, setLoadingGet] = useState(false);

  const [searchType, setSearchType] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const { addToast } = useToasts();
  // pagination change control
  async function onPageChange(e, p) {
    console.log(p);
    await fetchData(p);
  }
  const fetchData = async (page) => {
    try {
      console.log("page", page);
      // const response = await axiosInstance.get(
      //   "/api/v1/auth/paging?page=" + (page - 1) + "&size=" + resultsPerPage
      // );
      const response = await axiosInstance.get("/api/v1/auth/allUsers");
      setData(response.data);
      setDataOrg(response.data);
      const totalPage = Math.ceil(response.data.length / resultsPerPage);
      setTotalPage(totalPage);
      setTotalResult(response.data.length);
      setData(
        response.data.slice((page - 1) * resultsPerPage, page * resultsPerPage)
      );
      setPage(page);
      setDataLoaded(true);
    } catch (error) {
      console.log("Fetch data error", error);
    }
  };

  const handleCheckboxChange = async (userId) => {
    console.log("Handle on change", userId);
    try {
      setLoadingGet(true);
      await axiosInstance.put(`/api/v1/auth/active/${userId}`);
      await fetchData(1);
      setLoadingGet(false);
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
  const closeModal = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsModalOpen(false);
  };
  const openModal = async () => {
    setIsModalOpen(true);
  };
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    admin: false,
  });
  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
    console.log(key, value);
  };
  const handleRegister = async (event) => {
    event.preventDefault();
    if (
      !formData.username ||
      !formData.password ||
      !formData.email ||
      !formData.firstName ||
      !formData.lastName
    ) {
      addToast("Please fill in all the required fields", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }
    try {
      let body = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        admin: formData.admin,
      };
      console.log("FormData:", formData);

      const response = await axiosInstance.post("/api/v1/auth/register", body);

      addToast("Create success", { appearance: "success", autoDismiss: true });
      closeModal();
      setFormData({
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        admin: false,
      });
      // window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      addToast("Failed", { appearance: "error", autoDismiss: true });
    }
  };

  const handleSearch = () => {
    try {
      let filter;
      switch (searchType) {
        case "User Name":
          filter = data.filter(
            (user) =>
              user.username &&
              user.username
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(
                  searchValue
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                )
          );
          break;
        case "First Name":
          filter = data.filter(
            (user) =>
              user.firstName &&
              user.firstName
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(
                  searchValue
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                )
          );
          break;
        case "Last Name":
          filter = data.filter(
            (user) =>
              user.lastName &&
              user.lastName
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(
                  searchValue
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                )
          );
          break;
        case "Email":
          filter = data.filter(
            (user) =>
              user.email &&
              user.email
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .includes(
                  searchValue
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                )
          );
          break;
        case "Role":
          switch (searchValue) {
            case "Role User":
              filter = data.filter(
                (user) => user.roles && user.roles.includes("ROLE_USER")
              );
              break;

            case "Role Admin":
              filter = data.filter(
                (user) => user.roles && user.roles.includes("ROLE_ADMIN")
              );
              break;
            default:
              filter = [...dataOrg];
          }
          break;
        default:
          filter = [...dataOrg];
      }
      setTotalResult(filter.length);
      setData(filter.slice((page - 1) * resultsPerPage, page * resultsPerPage));
      setTotalPage(Math.ceil(filter.length / resultsPerPage));
    } catch (error) {
      console.log("Error occurred while handling search", error.message);
      setTotalResult(data.length);
      setData(data.slice((page - 1) * resultsPerPage, page * resultsPerPage));
      setTotalPage(Math.ceil(data.length / resultsPerPage));
    }
  };
  useEffect(() => {
    handleSearch();
  }, [searchType, searchValue, page]);

  return (
    <div>
      {/* Breadcum */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={DashboardIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">All Users</p>
      </div>

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
        <Dialog
          open={isModalOpen}
          onClose={closeModal}
          PaperProps={{
            component: "form",
          }}
        >
          <Toolbar className="justify-between">
            <Typography
              sx={{ color: "#7e3af2", fontWeight: "bold", fontSize: 19 }}
            >
              Add New Account
            </Typography>
            <IconButton
              edge="end"
              style={{ color: "#7e3af2" }}
              onClick={closeModal}
              aria-label="close"
            >
              <Close />
            </IconButton>
          </Toolbar>
          <DialogContent dividers>
            <ModalBody className="ml-4 mr-4">
              <AccountForm
                data={formData}
                handleInputChange={handleInputChange}
              />
            </ModalBody>
          </DialogContent>
          <DialogActions className="mt-2 mb-2 mr-3">
            <div className="flex items-center gap-2">
              <Button layout="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button className="pl-6 pr-6" block onClick={handleRegister}>
                Add
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>

      {/* Search */}
      {/* <Card className="mt-5 mb-5 pt-3 pb-3 shadow-md flex justify-between items-center">
        <CardBody>
          <div className="flex items-center">
            <p className="text-md text-gray-600 dark:text-gray-400">
              All Users
            </p>
          </div>
        </CardBody>
        <Label className="mx-0 ml-auto">
          <Select
            className="py-3 rounded-r-none bg-purple-200"
            onChange={(e) => {
              setSearchType(e.target.value);
              setSearchValue("");
              setPage(1);
            }}
          >
            <option hidden>Choose to search</option>
            <option>User Name</option>
            <option>First Name</option>
            <option>Last Name</option>
            <option>Email</option>
            <option>Role</option>
          </Select>
        </Label>
        <Label className="mx-0 w-70">
          <div className="relative text-gray-500 dark:focus-within:text-purple-400">
            {searchType === "Role" ? (
              <Select
                className="py-3 pl-5 pr-10 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input rounded-r-sm w-70"
                value={searchValue}
                onChange={(e) => {
                  setPage(1);
                  setSearchValue(e.target.value);
                }}
              >
                <option hidden>Select a Option</option>
                <option>Role Admin</option>
                <option>Role User</option>
              </Select>
            ) : (
              <div>
                <input
                  type="text"
                  className="py-3 pl-5 pr-10 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input rounded-r-full w-70"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => {
                    setPage(1);
                    setSearchValue(e.target.value);
                  }}
                />
                <div className="absolute inset-y-0 right-0 flex items-center mr-3 cursor-pointer">
                  <SearchIcon
                    className="w-5 h-5 text-purple-500 transition-colors duration-200"
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}
          </div>
        </Label>
        <RoundIcon
          icon={RefreshIcon}
          onClick={() => {
            setSearchType("Choose to search");
            setSearchValue("");
            setPage(1);
            setResultPerPage(resultsPerPage);
            setData(dataOrg);
            handleSearch();
          }}
          className="pr-3 mr-6 ml-3 hover:bg-gray-200 dark:hover:bg-gray-400 transition ease-in-out duration-200 cursor-pointer"
        />
      </Card> */}

      {/* Table */}
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
            <TableHeader>
              <tr>
                <TableCell>User Name</TableCell>
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
                            : // : "https://i.pinimg.com/564x/93/4e/37/934e37c613b24b4c7aa236644dd46fdc.jpg"
                              // : "https://i.pinimg.com/originals/c5/0e/50/c50e501274761567685ebb90fdea4460.jpg"
                              "https://i.pinimg.com/originals/90/48/9f/90489fda05254bb2fef245248e9befb1.jpg"
                        }
                        alt="User image"
                      />
                      <div>
                        <p className="font-semibold">{user.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-base">
                      {user.firstName ? user.firstName : "Unknown"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-base">
                      {user.lastName ? user.lastName : "Unknown"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-base">{user.email}</span>
                  </TableCell>
                  {/* <TableCell className="space-x-2">
                  {user.roles.map((role, index) => (
                    <Badge type="success" key={index}>
                      {role}
                    </Badge>
                  ))}
                </TableCell> */}
                  <TableCell className="space-x-2">
                    {user.roles.map((role, index) => (
                      <Badge
                        className={
                          role == "ROLE_USER"
                            ? "bg-purple-100 text-purple-700"
                            : role == "ROLE_ADMIN"
                            ? "bg-pink-100 text-pink-700"
                            : ""
                        }
                        key={index}
                      >
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
              <Paginate
                totalPages={totalPages}
                totalResults={totalResults}
                page={page}
                onPageChange={onPageChange}
              />
              // <Pagination
              //   totalResults={totalResults}
              //   resultsPerPage={resultsPerPage}
              //   label="Table navigation"
              //   onChange={(page) => onPageChange(page)}
              // />
            )}
          </TableFooter>
        </TableContainer>
      )}
    </div>
  );
};

export default UsersTable;
