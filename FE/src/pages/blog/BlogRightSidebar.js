import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogSidebar from "../../wrappers/blog/BlogSidebar";
// import BlogPagination from "../../wrappers/blog/BlogPagination";
import BlogPosts from "../../wrappers/blog/BlogPosts";
import axiosInstance from "../../axiosInstance";
import { useToasts } from "react-toast-notifications";

const BlogRightSidebar = ({ location }) => {
  const { pathname } = location;
  const { addToast } = useToasts();
  const [blogData, setBlogData] = useState({
    search: "",
    selectedPage: 0,
    totalPage: 0,
    blogs: [],
  });
  const [recentBlogData, setRecentBlogData] = useState({
    search: "",
    selectedPage: 0,
    totalPage: 0,
    blogs: [],
  });

  useEffect(() => {
    const loadRecentBlog = async (page) => {
      const response = await axiosInstance.get(
        "/api/v1/blogs/paging?size=5&page=" + page
      );
      var resData = response.data;
      setRecentBlogData({
        ...recentBlogData,
        selectedPage: resData.pageable.pageNumber,
        totalPage: resData.totalPages,
        blogs: resData.content,
      });
    };
    fetchData(0);
    loadRecentBlog(0);
  }, []);
  const fetchData = async (page, search) => {
    try {
      let searchKey = search ? search : "";
      const response = await axiosInstance.get(
        "/api/v1/blogs/paging?page=" + page + "&search=" + searchKey
      );
      var resData = response.data;
      setBlogData({
        ...blogData,
        search: searchKey,
        selectedPage: resData.pageable.pageNumber,
        totalPage: resData.totalPages,
        blogs: resData.content,
      });
    } catch (error) {
      addToast("Fail to load data Blog", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  // const handleNextEvent = () => {
  //   if (blogData.selectedPage < blogData.totalPage - 1) {
  //     fetchData(blogData.selectedPage + 1);
  //   }
  // };
  // const handlePreviousEvent = () => {
  //   if (blogData.selectedPage > 0) {
  //     fetchData(blogData.selectedPage + 1);
  //   }
  // };
  // const handleSelectPageEvent = (page) => {
  //   fetchData(page);
  // };
  const handelSearchEvent = (search) => {
    fetchData(0, search);
  };

  return (
    <Fragment>
      <MetaTags>
        <title>Floravibe | Blog</title>
        <meta
          name="description"
          content="Blog of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Blog
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="blog-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-3">
                {/* blog sidebar */}
                <BlogSidebar
                  recentBlogData={recentBlogData}
                  onSearchEvent={handelSearchEvent}
                />
              </div>
              <div className="col-lg-9">
                <div className="mr-20">
                  <div className="row">
                    <BlogPosts data={blogData.blogs} />
                  </div>
                  {/* <BlogPagination
                    totalPage={blogData.totalPage}
                    selectedPage={blogData.selectedPage}
                    onNextEvent={handleNextEvent}
                    onPreviousEvent={handlePreviousEvent}
                    onSelectPageEvent={handleSelectPageEvent}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

BlogRightSidebar.propTypes = {
  location: PropTypes.object,
};

export default BlogRightSidebar;
