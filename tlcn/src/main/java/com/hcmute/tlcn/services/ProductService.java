package com.hcmute.tlcn.services;

import com.hcmute.tlcn.dtos.collection.CollectionDto;
import com.hcmute.tlcn.dtos.product.ProductDto;
import com.hcmute.tlcn.dtos.review.ReviewDto;
import com.hcmute.tlcn.entities.Blog;
import com.hcmute.tlcn.entities.Collection;
import com.hcmute.tlcn.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    Page<Product> getPaging(String search, Pageable pageable);

    Product getProductById(String id);

    Product addNew(ProductDto dto);

    Product update(String id, ProductDto dto);

    Product delete(String id);

    Product addReview(String id, ReviewDto reviewDto,String accountName, String orderId);

    Product updateReview(String id, String reviewId,ReviewDto reviewDto,String orderId);

    Product deleteReview(String id, String reviewId);
}
