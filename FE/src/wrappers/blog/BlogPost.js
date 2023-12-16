import React, { Fragment } from "react";
import BlogModel from "../../model/blogmodel";

const BlogPost = (input) => {
  const blogData = new BlogModel(
    input.blogData.id,
    input.blogData.content,
    input.blogData.title,
    input.blogData.author,
    input.blogData.image,
    input.blogData.category,
    input.blogData.createdDate
  );
  return (
    <Fragment>
      <div className="blog-details-top">
        <div className="blog-details-img">
          <img
            alt=""
            src={blogData.image}
          />
        </div>
        <div className="blog-details-content">
          <div className="blog-meta-2">
            <ul>
              <li>{blogData.getCreatedDate()}</li>
            </ul>
          </div>
          <h3>{blogData.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: blogData.content }} />
        </div>
      </div>
      <div className="tag-share">
        <div className="dec-tag">
          <ul>
            {blogData.category.map((item, index) => (
              (index === blogData.category.length - 1) ? (
                <li key={index}>
                  {item}
                </li>
              ) : (
                <li key={index}>
                  {item} ,
                </li>
              )
            ))}
          </ul>
        </div>
        <div className="blog-share">
          <span>Author :</span>
          <div className="share-social">
            <ul>
              <li>
                {blogData.author}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default BlogPost;
