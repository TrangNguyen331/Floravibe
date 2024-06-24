import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Label,
  Button,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";
import PageTitle from "../components/Typography/PageTitle";
import { NavLink } from "react-router-dom";
import {
  AddIcon,
  EditIcon,
  DashboardIcon,
  SearchIcon,
  RefreshIcon,
  UpIcon,
  DownIcon,
  SortDefaultIcon,
  TrashIcon,
} from "../icons";
import RoundIcon from "../components/RoundIcon";
import axiosInstance from "../axiosInstance";
import { useToasts } from "react-toast-notifications";
import CollectionForm from "../components/CollectionForm";
import { FaSpinner } from "react-icons/fa";
import ".././assets/css/customLoading.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
function Icon({ icon, ...props }) {
  const Icon = icon;
  return <Icon {...props} />;
}

const Collection = () => {
  const [data, setData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [sortName, setSortName] = useState("default");
  const [dataOrg, setDataOrg] = useState([]);
  const { addToast } = useToasts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [mode, setMode] = useState("add"); // 'add', 'edit', 'delete'
  const [collectionData, setCollectionData] = useState({
    id: null,
    name: null,
  });

  const closeModal = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setMode(null);
    setIsModalOpen(false);
  };

  const openModal = async (mode, collectionId) => {
    if (mode === "edit" || mode === "delete") {
      let result = await data.find((item) => item.id === collectionId);
      setCollectionData(result);
    } else {
      setCollectionData({
        id: null,
        name: null,
      });
    }
    setMode(mode);
    setIsModalOpen(true);
  };

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/collections/all");
      setData(response.data);
      setDataOrg(response.data);
      setDataLoaded(true);
    } catch (error) {
      console.log("Fetch data error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (mode) => {
    if (!collectionData.name) {
      addToast("Please fill in all the required fields", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }
    setLoadingSave(true);
    try {
      let body = {
        name: collectionData.name,
      };
      if (mode === "add") {
        await axiosInstance.post("/api/v1/collections", body);
        closeModal();
        addToast("Added new tag successfully", {
          appearance: "success",
          autoDismiss: true,
        });
      } else if (mode === "edit") {
        await axiosInstance.put(
          `/api/v1/collections/${collectionData.id}`,
          body
        );
        setData((prevData) =>
          prevData.map((item) =>
            item.id === collectionData.id
              ? { ...item, ...collectionData }
              : item
          )
        );
        closeModal();
        addToast("Save change successfully", {
          appearance: "success",
          autoDismiss: true,
        });
      } else if (mode === "delete") {
        await axiosInstance.delete("/api/v1/collections/" + collectionData.id);
        closeModal();
        addToast("Delete successfully", {
          appearance: "success",
          autoDismiss: true,
        });
      }
      setCollectionData({
        id: null,
        name: null,
      });
      fetchData();
      setLoadingSave(false);
    } catch (error) {
      addToast("An error occurred while saving. Please try again.", {
        appearance: "error",
        autoDismiss: true,
      });
      console.error("Error saving collection:", error);
    }
  };

  const handleInputChange = (key, value) => {
    setCollectionData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSortName = () => {
    try {
      let newSort, sortedData;
      switch (sortName) {
        case "default":
          newSort = "asc";
          sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "asc":
          newSort = "desc";
          sortedData = [...data].sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "desc":
          newSort = "default";
          sortedData = [...dataOrg];
          break;
      }
      setSortName(newSort);
      setData(sortedData);
    } catch (error) {
      console.error(
        "An error occurred during sorting by name: ",
        error.message
      );
    }
  };

  const handleSearch = () => {
    try {
      if (searchValue === "") {
        setData(dataOrg);
      } else {
        const filteredData = dataOrg.filter((collection) =>
          collection.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setData(filteredData);
      }
    } catch (error) {
      console.error("An error occurred during search", error.message);
    }
  };
  useEffect(() => {
    handleSearch();
  }, [searchValue]);
  const abc = () => {};
  return (
    <div>
      <PageTitle>Product Categories</PageTitle>
      {/* Breadcrumb */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={DashboardIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Categories</p>
      </div>

      {/* Add */}
      <div className="flex items-center justify-end mt-5 mb-5">
        <div className="flex">
          <Button
            size="large"
            iconLeft={AddIcon}
            className="mx-3"
            onClick={() => openModal("add", null)}
          >
            Add Category
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="mt-5 mb-5 pt-3 pb-3 shadow-md flex justify-between items-center">
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All Categories
              </p>
            </div>
          </div>
        </CardBody>
        <div className="flex items-center">
          <Label className="mx-0 w-70">
            <div className="relative text-gray-500 dark:focus-within:text-purple-400 w-90">
              <div className="absolute inset-y-0 left-0 flex items-center ml-3">
                <SearchIcon
                  className="w-5 h-5 text-purple-500 transition-colors duration-200"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                className="py-3 pl-10 pr-10 text-sm text-black dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input rounded-full w-90"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </Label>
          <RoundIcon
            icon={RefreshIcon}
            onClick={() => {
              setSearchValue("");
              handleSearch();
            }}
            className="pr-3 mr-6 ml-3 hover:bg-gray-200 dark:hover:bg-gray-400 transition ease-in-out duration-200 cursor-pointer"
          />
        </div>
      </Card>

      {/* Modal */}
      <div>
        <Dialog
          open={isModalOpen}
          onClose={closeModal}
          maxWidth="sm"
          fullWidth={true}
          disableBackdropClick={true}
          disableEscapeKeyDown={true}
          PaperProps={{
            component: "form",
          }}
        >
          <Toolbar className="justify-between">
            <Typography
              sx={{ color: "#7e3af2", fontWeight: "bold", fontSize: 19 }}
            >
              {mode === "add" && "Add New Category"}
              {mode === "edit" && "Edit Category"}
              {mode === "delete" && "Delete Category"}
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
            <ModalBody>
              {mode === "add" ? (
                <CollectionForm
                  data={collectionData}
                  handleInputChange={handleInputChange}
                />
              ) : mode === "edit" ? (
                <CollectionForm
                  data={collectionData}
                  handleInputChange={handleInputChange}
                />
              ) : (
                <p>
                  Are you sure to delete collection{" "}
                  {collectionData && `"${collectionData.name}"`}
                </p>
              )}
            </ModalBody>
          </DialogContent>
          <DialogActions className="mt-2 mb-2 mr-3">
            <div className="hidden sm:block">
              <Button layout="outline" onClick={closeModal}>
                Cancel
              </Button>
            </div>
            <div className="hidden sm:block">
              {mode === "edit" ? (
                <Button block onClick={() => handleSave("edit")}>
                  Save
                </Button>
              ) : (
                <Button block onClick={() => handleSave("add")}>
                  {loadingSave ? <FaSpinner className="animate-spin" /> : null}
                  Add
                </Button>
              )}
            </div>
          </DialogActions>
        </Dialog>
      </div>

      {/* Table */}
      <TableContainer className="mb-8 mt-5">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>
                <div className="flex items-center">
                  Name
                  <div className="cursor-pointer">
                    <Icon
                      className="w-3 h-3 ml-2 text-purple-600 hover:text-red-500"
                      aria-hidden="true"
                      onClick={handleSortName}
                      icon={
                        sortName === "asc"
                          ? UpIcon
                          : sortName === "desc"
                          ? DownIcon
                          : SortDefaultIcon
                      }
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataLoaded &&
              data.map((collection, i) => (
                <TableRow key={i}>
                  <TableCell className="text-base">{collection.name}</TableCell>
                  <TableCell>
                    <div className="flex">
                      <Button
                        icon={EditIcon}
                        className="mr-3"
                        layout="outline"
                        aria-label="Edit"
                        onClick={() => openModal("edit", collection.id)}
                      />
                      <Button
                        icon={TrashIcon}
                        layout="outline"
                        aria-label="Delete"
                        onClick={() => openModal("delete", collection.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Collection;
