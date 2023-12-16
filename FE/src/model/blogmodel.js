class BlogModel {
    constructor(id, content, title, author, image, category, createdDate) {
        this.id = id;
        this.content = content;
        this.title = title;
        this.author = author;
        this.image = image;
        this.category = category;
        this.createdDate = createdDate;
    }

    getCreatedDate() {
        const dateObject = new Date(this.createdDate);

        // Format the date components
        const day = dateObject.getDate();
        const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(dateObject);
        const year = dateObject.getFullYear();

        const formattedDate = `${day} ${month}, ${year}`;
        return formattedDate;
    }

    getContentLimit(maxchar) {
        return this.content.length > maxchar ? this.content.slice(0, maxchar) + '...' : this.content
    }

    getTitleLimit(){
        return this.title.length > 10 ? this.title.slice(0, 10) + '...' : this.title
    }

}
export default BlogModel;