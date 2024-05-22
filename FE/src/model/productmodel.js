class ProductModel {
  constructor(
    id,
    name,
    description,
    additionalInformation,
    price,
    tags,
    images,
    reviews,
    collections,
    stockQty
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.additionalInformation = additionalInformation;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.reviews = reviews;
    this.collections = collections;
    this.stockQty = stockQty;
  }
}
export default ProductModel;
