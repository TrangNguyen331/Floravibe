import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/Typography/PageTitle";
import { HomeIcon } from "../icons";
import { Card, CardBody, Badge } from "@windmill/react-ui";
import axiosInstance from "../axiosInstance";
const SingleBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/blogs/" + id);
        setBlog(response.data);
      } catch (error) {}
    };
    fetchData();
  }, []);

  console.log("blog", blog);
  return (
    <div>
      <PageTitle>Blog Details</PageTitle>
      {blog ? (
        <div>
          {/* Breadcum */}
          <div className="flex text-gray-800 dark:text-gray-300">
            <div className="flex items-center text-purple-600">
              <Icon className="w-5 h-5" aria-hidden="true" icon={HomeIcon} />
              <NavLink exact to="/app/dashboard" className="mx-2">
                Dashboard
              </NavLink>
            </div>
            {">"}
            <NavLink exact to="/app/blogs" className="mx-2 text-purple-600">
              All Blogs
            </NavLink>
            {">"}
            <p className="mx-2">{}</p>
          </div>
          {/* Blog overview  */}
          <Card className="my-8 shadow-md">
            <CardBody>
              <div className="mx-8 my-6">
                <h1 className="text-3xl mb-4 font-semibold text-gray-700 dark:text-gray-200">
                  {blog.title}
                </h1>
                <div className="text-base">
                  Publish date:{" "}
                  {new Date(blog.createdDate).toLocaleDateString()}
                </div>
                <span className="text-base">
                  Last modify date:{" "}
                  {new Date(blog.lastModifyDate).toLocaleDateString()}
                </span>
              </div>

              <div>
                <img
                  src={blog.image}
                  alt=""
                  className="max-w-2xl m-auto rounded-lg blog-details-img"
                />
              </div>

              <div className="mx-8 mt-6 pt-5 md:pt-0 text-justify">
                <div
                  style={{ fontSize: "18px" }}
                  dangerouslySetInnerHTML={{ __html: blog.content || "" }}
                ></div>

                <div className="flex items-center justify-between py-5">
                  <div className="text-gray-500 text-sm font-semibold">
                    Author: {blog.author}
                  </div>
                  <div className="">
                    {blog && blog.category && blog.category.length > 0
                      ? blog.category.map((category, index) => (
                          <Badge type="success" key={index} className="mr-3">
                            {category}
                          </Badge>
                        ))
                      : ""}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SingleBlog;
