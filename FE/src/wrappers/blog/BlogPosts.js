import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import BlogModel from "../../model/blogmodel";

const BlogPosts = (input) => {
  const blogs = input.data.map(
    (blog) =>
      new BlogModel(
        blog.id,
        blog.content,
        blog.title,
        blog.author,
        blog.image,
        blog.category,
        blog.createdDate
      )
  );
  const truncateContent = (content) => {
    const trimmedString = content.substr(0, 120);
    return trimmedString;
  };
  return (
    <Fragment>
      {blogs.map((blog) => (
        <div key={blog.id} className="col-lg-6 col-md-6 col-sm-12">
          <div className="blog-wrap-2 mb-30">
            <div className="blog-img-2">
              <Link
                to={
                  process.env.PUBLIC_URL + "/blog-details-standard/" + blog.id
                }
              >
                <img src={blog.image || ""} alt="" />
              </Link>
            </div>
            <div className="blog-content-2">
              <div className="blog-meta-2">
                <ul>
                  <li>{blog.getCreatedDate()}</li>
                </ul>
              </div>
              <h4 style={{ lineHeight: "26px" }}>
                <Link
                  to={
                    process.env.PUBLIC_URL + "/blog-details-standard/" + blog.id
                  }
                >
                  {blog.title}
                </Link>
              </h4>
              <p
                dangerouslySetInnerHTML={{
                  __html: truncateContent(blog.content) + "..." || "",
                }}
              ></p>
              <div className="blog-share-comment">
                <div className="blog-btn-2">
                  <Link
                    to={
                      process.env.PUBLIC_URL +
                      "/blog-details-standard/" +
                      blog.id
                    }
                  >
                    read more
                  </Link>
                </div>
                <div className="blog-share">
                  <span>share :</span>
                  <div className="share-social">
                    <ul>
                      <li>
                        <a className="facebook" href="//facebook.com">
                          <i className="fa fa-facebook" />
                        </a>
                      </li>
                      <li>
                        <a className="twitter" href="//twitter.com">
                          <i className="fa fa-twitter" />
                        </a>
                      </li>
                      <li>
                        <a className="instagram" href="//instagram.com">
                          <i className="fa fa-instagram" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Fragment>
  );
};

export default BlogPosts;
