// get products
export const getProducts = (products, category, type, limit) => {
  const finalProducts = category
    ? products.filter((product) =>
        product.collections.some((col) =>
          col.name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(category.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        )
      )
    : products;
  if (type && type === "roses") {
    const newProducts = finalProducts.filter((single) =>
      single.tags.some(
        (col) =>
          col.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
          "Hoa Hồng".normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      )
    );
    return newProducts.slice(0, limit || newProducts.length);
  }
  if (type && type === "baby") {
    const newProducts = finalProducts.filter((single) =>
      single.tags.some((col) => col.name.includes("Baby"))
    );
    return newProducts.slice(0, limit || newProducts.length);
  }
  if (type && type === "tulip") {
    const newProducts = finalProducts.filter((single) =>
      single.tags.some((col) => col.name.includes("Tulip"))
    );
    return newProducts.slice(0, limit || newProducts.length);
  }

  return finalProducts.slice(0, limit || finalProducts.length);
};
// get product discount price
export const getDiscountPrice = (price, discount) => {
  return discount && discount > 0 ? price - price * (discount / 100) : null;
};

// get product cart quantity
export const getProductCartQuantity = (cartItems, product, color, size) => {
  let productInCart = cartItems.filter(
    (single) =>
      single.id === product.id &&
      (single.selectedProductColor
        ? single.selectedProductColor === color
        : true) &&
      (single.selectedProductSize ? single.selectedProductSize === size : true)
  )[0];
  if (cartItems.length >= 1 && productInCart) {
    if (product.variation) {
      return cartItems.filter(
        (single) =>
          single.id === product.id &&
          single.selectedProductColor === color &&
          single.selectedProductSize === size
      )[0].quantity;
    } else {
      return cartItems.filter((single) => product.id === single.id)[0].quantity;
    }
  } else {
    return 0;
  }
};

//get products based on category
export const getSortedProducts = (products, sortType, sortValue) => {
  let sortedProducts = [...products];
  switch (sortType) {
    case "category":
      sortedProducts = sortedProducts.filter(
        (product) =>
          product.collections.filter(
            (single) =>
              single.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
              sortValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          )[0]
      );
      break;
    case "tag":
      sortedProducts = sortedProducts.filter(
        (product) =>
          product.tags.filter((single) => single.name === sortValue)[0]
      );
      break;
    case "priceRange":
      const [minPrice, maxPrice] = sortValue;
      sortedProducts = sortedProducts.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
      break;
    case "filterSort":
      if (sortValue === "default") {
        return sortedProducts;
      }
      if (sortValue === "priceHighToLow") {
        return sortedProducts.sort((a, b) => b.price - a.price);
      }
      if (sortValue === "priceLowToHigh") {
        return sortedProducts.sort((a, b) => a.price - b.price);
      }
      break;
    default:
      break;
  }
  // if (products && sortType && sortValue) {
  //   if (sortType === "category") {
  //     return products.filter(
  //       (product) =>
  //         product.collections.filter(
  //           (single) =>
  //             single.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
  //             sortValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  //         )[0]
  //     );
  //   }
  //   if (sortType === "tag") {
  //     return products.filter(
  //       (product) =>
  //         product.tags.filter((single) => single.name === sortValue)[0]
  //     );
  //   }
  //   if (sortType === "priceRange") {
  //     return products.filter(
  //       (product) =>
  //         product.price >= sortValue[0] && product.price <= sortValue[1]
  //     );
  //   }
  //   if (sortType === "filterSort") {
  //     let sortProducts = [...products];
  //     if (sortValue === "default") {
  //       return sortProducts;
  //     }
  //     if (sortValue === "priceHighToLow") {
  //       return sortProducts.sort((a, b) => {
  //         return b.price - a.price;
  //       });
  //     }
  //     if (sortValue === "priceLowToHigh") {
  //       return sortProducts.sort((a, b) => {
  //         return a.price - b.price;
  //       });
  //     }
  //   }
  // }
  return sortedProducts;
};

// get individual element
const getIndividualItemArray = (array) => {
  let individualItemArray = array.filter(function (v, i, self) {
    return i === self.indexOf(v);
  });
  return individualItemArray;
};

// get individual categories
export const getIndividualCategories = (products) => {
  let productCategories = products.reduce((acc, product) => {
    if (product.collections) {
      product.collections.forEach((single) => {
        acc.push(single.name);
      });
    }
    return acc;
  }, []);

  const individualProductCategories = getIndividualItemArray(productCategories);
  return individualProductCategories;
};

// get individual tags
export const getIndividualTags = (products) => {
  let productTags = products.reduce((acc, product) => {
    if (product.tags) {
      product.tags.forEach((single) => {
        acc.push(single.name);
      });
    }
    return acc;
  }, []);

  const individualProductTags = getIndividualItemArray(productTags);
  return individualProductTags;
};

// get individual colors
export const getIndividualColors = (products) => {
  let productColors = [];
  products &&
    products.map((product) => {
      return (
        product.variation &&
        product.variation.map((single) => {
          return productColors.push(single.color);
        })
      );
    });
  const individualProductColors = getIndividualItemArray(productColors);
  return individualProductColors;
};

// get individual sizes
export const getProductsIndividualSizes = (products) => {
  let productSizes = [];
  products &&
    products.map((product) => {
      return (
        product.variation &&
        product.variation.map((single) => {
          return single.size.map((single) => {
            return productSizes.push(single.name);
          });
        })
      );
    });
  const individualProductSizes = getIndividualItemArray(productSizes);
  return individualProductSizes;
};

// get product individual sizes
export const getIndividualSizes = (product) => {
  let productSizes = [];
  product.variation &&
    product.variation.map((singleVariation) => {
      return (
        singleVariation.size &&
        singleVariation.size.map((singleSize) => {
          return productSizes.push(singleSize.name);
        })
      );
    });
  const individualSizes = getIndividualItemArray(productSizes);
  return individualSizes;
};

export const setActiveSort = (e) => {
  const filterButtons = document.querySelectorAll(
    ".sidebar-widget-list-left button, .product-filter button"
  );
  filterButtons.forEach((item) => {
    item.classList.remove("active");
  });
  if (e && e.currentTarget) {
    e.currentTarget.classList.add("active");
  }
};
export const setActiveTagSort = (e) => {
  const filterButtons = document.querySelectorAll(
    ".sidebar-widget-tag button, .product-filter button"
  );
  filterButtons.forEach((item) => {
    item.classList.remove("active");
  });
  if (e && e.currentTarget) {
    e.currentTarget.classList.add("active");
  }
};

export const setActiveLayout = (e) => {
  const gridSwitchBtn = document.querySelectorAll(".shop-tab button");
  gridSwitchBtn.forEach((item) => {
    item.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};

export const toggleShopTopFilter = (e) => {
  const shopTopFilterWrapper = document.querySelector(
    "#product-filter-wrapper"
  );
  shopTopFilterWrapper.classList.toggle("active");
  if (shopTopFilterWrapper.style.height) {
    shopTopFilterWrapper.style.height = null;
  } else {
    shopTopFilterWrapper.style.height =
      shopTopFilterWrapper.scrollHeight + "px";
  }
  e.currentTarget.classList.toggle("active");
};
