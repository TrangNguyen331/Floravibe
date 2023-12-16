import React from "react";
import { Input } from "@windmill/react-ui";
import { TagsInput } from "react-tag-input-component";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../index.css";
const BlogForm = ({ data, onSave, onCancel, onBlogChange }) => {
  const handleCategoryChange = (category) => {
    onBlogChange("category", category);
  };
  const handleContentChange = (e, editor) => {
    const data = editor.getData();
    onBlogChange("content", data);
  };
  return (
    <form action="#">
      <div>
        <div className="block mb-4 text-sm font-medium text-gray-900 dark:text-white">
          <strong>Image</strong>
          <Input
            type="text"
            className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            onChange={(e) => onBlogChange("image", e.target?.value || "")}
            value={(data && data.image) || ""}
          />
        </div>
        <div className="grid gap-4 mb-4 grid-cols-2">
          <div className="block text-sm font-medium text-gray-900 dark:text-white">
            <strong>Title</strong>
            <Input
              type="text"
              className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-opacity-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              onChange={(e) => onBlogChange("title", e.target?.value || "")}
              value={(data && data.title) || ""}
            />
          </div>
          <div className="block text-sm font-medium text-gray-900 dark:text-white">
            <strong>Author</strong>
            <Input
              type="text"
              className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-opacity-0 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              onChange={(e) => onBlogChange("author", e.target?.value || "")}
              value={(data && data.author) || ""}
            />
          </div>
        </div>
        <div className="block mb-4 text-sm font-medium text-gray-900 dark:text-white">
          <strong>Blog Category</strong>
          <TagsInput
            type="text"
            className="mt-2 bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder=""
            onChange={handleCategoryChange}
            value={(data && data.category) || []}
          />
        </div>

        <div className="block mt-2 text-sm font-medium text-gray-900 dark:text-white">
          <strong>Content</strong>
          <CKEditor
            editor={ClassicEditor}
            onChange={(event, editor) => {
              handleContentChange(event, editor);
            }}
            config={{
              heading: {
                options: [
                  {
                    model: "paragraph",
                    title: "Paragraph",
                    class: "ck-heading_paragraph",
                  },
                  {
                    model: "heading1",
                    view: "h1",
                    title: "Heading 1",
                    class: "ck-heading_heading1",
                  },
                  {
                    model: "heading2",
                    view: "h2",
                    title: "Heading 2",
                    class: "ck-heading_heading2",
                  },
                  {
                    model: "heading3",
                    view: "h3",
                    title: "Heading 3",
                    class: "ck-heading_heading3",
                  },
                  {
                    model: "heading4",
                    view: "h4",
                    title: "Heading 4",
                    class: "ck-heading_heading4",
                  },
                  {
                    model: "heading5",
                    view: "h5",
                    title: "Heading 5",
                    class: "ck-heading_heading5",
                  },
                  {
                    model: "heading6",
                    view: "h6",
                    title: "Heading 6",
                    class: "ck-heading_heading6",
                  },
                ],
              },
            }}
            data={(data && data.content) || ""}
          />
        </div>
      </div>
    </form>
  );
};

export default BlogForm;
