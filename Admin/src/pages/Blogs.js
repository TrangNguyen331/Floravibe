import React, { useEffect, useState } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { Link, NavLink } from "react-router-dom";
import {
  EditIcon,
  HomeIcon,
  TrashIcon,
  AddIcon,
  DashboardIcon,
} from "../icons";
import Icon from "../components/Icon";
import "../index.css";
import axiosInstance from "../axiosInstance";
import BlogForm from "../components/BlogForm";
import {
  Card,
  CardBody,
  Button,
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
} from "@windmill/react-ui";
import {
  Grid,
  Typography,
  Pagination,
  DialogActions,
  Dialog,
  Toolbar,
  IconButton,
  Divider,
  Paper,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useToasts } from "react-toast-notifications";
import Paginate from "../components/Pagination/Paginate";
import { Close } from "@mui/icons-material";
const Blogs = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const { addToast } = useToasts();
  // pagination setup
  const [resultsPerPage, setResultsPerPage] = useState(4);
  const [totalPages, setTotalPage] = useState(0);
  const [totalResults, setTotalResult] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  //const totalResults = response.length;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState(null); // 'add', 'edit', 'delete'

  const [selectedBlog, setSelectedBlog] = useState({
    id: "",
    title: "",
    content: "",
    author: "",
    image: "",
    category: [],
    createdDate: "",
    lastModifyDate: "",
  });
  const closeModal = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setMode(null);
    setSelectedBlog({
      id: "",
      title: "",
      content: "",
      author: "",
      image: "",
      category: [],
      createdDate: "",
      lastModifyDate: "",
    });
    setIsModalOpen(false);
  };
  const handleSave = async (mode) => {
    if (
      !selectedBlog.image ||
      !selectedBlog.author ||
      !selectedBlog.content ||
      !selectedBlog.title ||
      selectedBlog.category.length === 0
    ) {
      addToast("Please fill in all the required fields", {
        appearance: "warning",
        autoDismiss: true,
      });
      return;
    }
    try {
      if (mode === "delete") {
        try {
          await axiosInstance.delete("/api/v1/blogs/" + selectedBlog.id);
        } catch (error) {
          console.log("Error", error);
        }
      }
      if (mode === "edit") {
        let body = {
          image: selectedBlog.image,
          author: selectedBlog.author,
          content: selectedBlog.content,
          title: selectedBlog.title,
          category: selectedBlog.category,
        };
        try {
          await axiosInstance.put("/api/v1/blogs/" + selectedBlog.id, body);
        } catch (error) {
          console.log("Error", error);
        }
      }
      if (mode === "add") {
        let body = {
          image: selectedBlog.image,
          author: selectedBlog.author,
          content: selectedBlog.content,
          title: selectedBlog.title,
          category: selectedBlog.category,
        };
        try {
          await axiosInstance.post("/api/v1/blogs", body);
        } catch (error) {
          console.log("Error", error);
        }
      }
      setMode(null);
      setSelectedBlog({
        id: "",
        title: "",
        content: "",
        author: "",
        image: "",
        category: [],
        createdDate: "",
        lastModifyDate: "",
      });
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Save error:", error);
    }
  };
  const openModal = async (mode, blogId) => {
    console.log("Blog", blogId);
    if (mode === "edit" || mode === "delete") {
      let blog = await data.filter((blog) => blog.id === blogId)[0];
      setSelectedBlog(blog);
    } else {
      setSelectedBlog({
        id: "",
        title: "",
        content: "",
        author: "",
        image: "",
        category: [],
        createdDate: "",
        lastModifyDate: "",
      });
    }
    setMode(mode);
    setIsModalOpen(true);
  };
  const onPageChange = async (e, p) => {
    await fetchData(p);
  };
  const fetchData = async (page) => {
    try {
      // const response = await axiosInstance.get(
      //   "/api/v1/blogs/paging?page=" + (page - 1) + "&size=" + resultsPerPage
      // );
      const response = await axiosInstance.get(
        "/api/v1/blogs/paging?page=&size=30"
      );
      console.log("Response data", response.data.content);

      const sortedData = response.data.content.sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );
      setData(response.data.content);
      setPage(page);
      setTotalPage(response.data.totalPages);
      setTotalResult(response.data.totalElements);
      setDataLoaded(true);
    } catch (error) {
      console.log("Fetch data error", error);
    }
  };
  const handleBlogChange = (property, value) => {
    setSelectedBlog((prevProduct) => ({
      ...prevProduct,
      [property]: value,
    }));
  };
  useEffect(() => {
    fetchData(1);
  }, []);
  return (
    <div>
      <PageTitle>Blogs</PageTitle>

      {/* Breadcum */}
      <div className="flex text-gray-800 dark:text-gray-300">
        <div className="flex items-center text-purple-600">
          <Icon className="w-5 h-5" aria-hidden="true" icon={DashboardIcon} />
          <NavLink exact to="/app/dashboard" className="mx-2">
            Dashboard
          </NavLink>
        </div>
        {">"}
        <p className="mx-2">Blogs</p>
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
            Add Blog
          </Button>
        </div>
      </div>

      <div>
        {/* <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          className="fullscreen-modal"
        >
          <ModalHeader className="flex items-center text-2xl">
            {mode === "edit" && "Edit Blog"}
            {mode === "delete" && "Delete Blog"}
            {mode === "add" && "Add New Blog"}
          </ModalHeader>
          <ModalBody>
            {mode === "edit" ? (
              <BlogForm
                data={selectedBlog}
                onSave={handleSave}
                onCancel={closeModal}
                onBlogChange={handleBlogChange}
              />
            ) : mode === "delete" ? (
              <p>
                Make sure you want to delete blog{" "}
                {selectedBlog && `"${selectedBlog.title}"`}
              </p>
            ) : (
              <BlogForm
                data={selectedBlog}
                onSave={handleSave}
                onCancel={closeModal}
                onBlogChange={handleBlogChange}
              />
            )}
          </ModalBody>
          <ModalFooter className="modal-footer">
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
              ) : mode === "delete" ? (
                <Button block onClick={() => handleSave("delete")}>
                  Delete
                </Button>
              ) : (
                <Button block size="large" onClick={() => handleSave("add")}>
                  Add Blog
                </Button>
              )}
            </div>
          </ModalFooter>
        </Modal> */}

        {mode === "edit" || mode === "add" ? (
          <Dialog open={isModalOpen} onClose={closeModal} maxWidth={"md"}>
            <div className="flex justify-between" sx={{ position: "relative" }}>
              <Toolbar className="flex-grow justify-between">
                <Typography
                  className="justify-between"
                  sx={{
                    ml: 2,
                    flex: 1,
                    color: "#7e3af2",
                    fontWeight: "bold",
                  }}
                  variant="h6"
                  component="div"
                >
                  {mode === "edit" && "Edit Blog"}
                  {mode === "add" && "Add Blog"}
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
            </div>
            <Divider />
            <DialogContent dividers>
              <DialogContentText tabIndex={-1}>
                {/* <Paper className="pt-8 pr-8 pl-8 pb-16" elevation={0}> */}
                <Paper className="p-8" elevation={0}>
                  <ModalBody className="modal-body">
                    <BlogForm
                      data={selectedBlog}
                      onSave={handleSave}
                      onCancel={closeModal}
                      onBlogChange={handleBlogChange}
                    />
                  </ModalBody>
                </Paper>
              </DialogContentText>
            </DialogContent>
            {/* <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
            <BottomNavigation className="mt-2 mb-2 mr-3">
              <div className="hidden sm:block">
                <Button layout="outline" onClick={closeModal}>
                  Cancel
                </Button>
              </div>
              <div className="hidden sm:block">
                <Button block onClick={() => handleSave("edit")}>
                  Save
                </Button>
              </div>
            </BottomNavigation>
          </Paper> */}
            <DialogActions className="mt-3 mb-3 mr-5">
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
                    Save
                  </Button>
                )}
              </div>
            </DialogActions>
          </Dialog>
        ) : (
          <Dialog
            onClose={closeModal}
            open={isModalOpen}
            className="flex justify-between"
          >
            <Toolbar className="justify-between">
              <Typography
                sx={{ color: "#7e3af2", fontWeight: "bold" }}
                variant="h6"
                component="div"
              >
                Delete Blog
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
              <Typography className="pt-5 pb-5 pl-4 pr-4">
                <p>
                  Make sure you want to delete blog{" "}
                  {selectedBlog && `"${selectedBlog.title}"`}
                </p>
              </Typography>
            </DialogContent>
            <DialogActions className="mt-2 mb-2 mr-3">
              <div className="hidden sm:block">
                <Button layout="outline" onClick={closeModal}>
                  Cancel
                </Button>
              </div>
              <div className="hidden sm:block">
                <Button block onClick={() => handleSave("delete")}>
                  Delete
                </Button>
              </div>
            </DialogActions>
            {/* <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
            <BottomNavigation className="mt-2 mb-2 mr-3">
              <div className="hidden sm:block">
                <Button layout="outline" onClick={closeModal}>
                  Cancel
                </Button>
              </div>
              <div className="hidden sm:block">
                <Button block onClick={() => handleSave("delete")}>
                  Delete
                </Button>
              </div>
            </BottomNavigation>
          </Paper> */}
          </Dialog>
        )}
      </div>

      {/* Blog Views */}
      <TableContainer className="mb-8">
        <Table>
          <TableHeader className="text-center">
            <tr>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Last Modify Date</TableCell>
              <TableCell>Action</TableCell>
            </tr>
          </TableHeader>
          <TableBody className="text-center">
            {data.map((blog) => (
              <TableRow
                key={blog.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <TableCell>
                  <div className="text-sm blog-img">
                    <Link to={`/app/blog/${blog.id}`}>
                      <img
                        className="hidden md:block"
                        src={blog.image || ""}
                        alt="Blog image"
                      />
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="whitespace-normal break-words font-semibold text-left">
                  <Link to={`/app/blog/${blog.id}`}>{blog.title || ""}</Link>
                </TableCell>

                <TableCell className="text-sm"> {blog.author || ""}</TableCell>
                <TableCell className="text-sm space-x-2">
                  {blog && blog.category && blog.category.length > 0
                    ? blog.category.map((category, index) => (
                        <Badge type="success" key={index}>
                          {category}
                        </Badge>
                      ))
                    : ""}
                </TableCell>
                <TableCell>
                  <span className="text-base">
                    {new Date(blog.createdDate).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-base">
                    {new Date(blog.lastModifyDate).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex">
                    <Button
                      icon={EditIcon}
                      className="mr-3"
                      layout="outline"
                      aria-label="Edit"
                      onClick={() => openModal("edit", blog.id)}
                    />
                    <Button
                      icon={TrashIcon}
                      layout="outline"
                      aria-label="Delete"
                      onClick={() => openModal("delete", blog.id)}
                    />
                  </div>
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
            // <Grid container justifyContent="space-between" alignItems="center" spacing={3}>
            //   <Grid item>
            //     <Typography component="span" sx={{ fontSize: 14 }}>Total Page:</Typography>
            //     <Typography component="span" sx={{ fontSize: 14, fontWeight: 'bold', pr: 2}}> {totalPages} </Typography>
            //     <Typography component="span" sx={{ fontSize: 15 }}>|</Typography>
            //     <Typography component="span" sx={{ fontSize: 14, pl: 2 }}>Total Items:</Typography>
            //     <Typography component="span" sx={{ fontSize: 14, fontWeight: 'bold' }}> {totalResults}</Typography>
            //   </Grid>
            //   <Grid item>
            //     <Pagination
            //       count={totalPages}
            //       page={page}
            //       onChange={onPageChange}
            //       sx={{
            //             '& .MuiPaginationItem-page.Mui-selected': {
            //               backgroundColor: '#7e3af2',
            //               color: '#fff',
            //               border: 0,
            //             },
            //           }}
            //       showFirstButton
            //       showLastButton
            //     />
            //   </Grid>
            // </Grid>
          )}
        </TableFooter>
      </TableContainer>
    </div>
  );
};

export default Blogs;
