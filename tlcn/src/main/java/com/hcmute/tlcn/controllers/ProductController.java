package com.hcmute.tlcn.controllers;

import com.hcmute.tlcn.dtos.product.ProductDto;
import com.hcmute.tlcn.dtos.review.ReviewDto;
import com.hcmute.tlcn.entities.Product;
import com.hcmute.tlcn.services.ProductService;
import com.hcmute.tlcn.utils.PageUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/${application.version}/products")
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping("/paging")
    public ResponseEntity<Page<Product>> getProductPaging(@RequestParam(name = "search", required = false, defaultValue = "") String search,
                                                          @RequestParam(name = "page", required = false, defaultValue = "${application.default.paging.page}") int page,
                                                          @RequestParam(name = "size", required = false, defaultValue = "${application.default.paging.size}") int size,
                                                          @RequestParam(name = "sort", required = false, defaultValue = "DESC") String sort,
                                                          @RequestParam(name = "column", required = false, defaultValue = "createdDate") String sortColumn){
        Pageable pageable = PageUtils.createPageable(page, size, sort, sortColumn);
        Page<Product> result = service.getPaging(search,pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id){
        Product result = service.getProductById(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

//    @GetMapping("/collection/{collectionId}/paging")
//    public ResponseEntity<Page<Product>> getPaging(
//            @PathVariable String collectionId,
//            @RequestParam(name = "search", required = false, defaultValue = "") String search,
//            @RequestParam(name = "page", required = false, defaultValue = "${application.default.paging.page}") int page,
//            @RequestParam(name = "size", required = false, defaultValue = "${application.default.paging.size}") int size,
//            @RequestParam(name = "sort", required = false, defaultValue = "DESC") String sort,
//            @RequestParam(name = "column", required = false, defaultValue = "createdDate") String sortColumn) {
//        Pageable pageable = PageUtils.createPageable(page, size, sort, sortColumn);
//        Page<Product> result = service.getPaging(search,pageable);
//        return new ResponseEntity<>(result, HttpStatus.OK);
//    }

    @PostMapping
    public ResponseEntity<Product> addNew(@RequestBody ProductDto dto) {
        Product result = service.addNew(dto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable String id, @RequestBody ProductDto dto) {
        Product result = service.update(id, dto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Product> delete(@PathVariable String id) {
        Product result = service.delete(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/review/{id}/{orderId}")
    public ResponseEntity<Product> addNewReview(@PathVariable String id, @RequestBody ReviewDto dto, Principal principal,@PathVariable String orderId) {
        Product result = service.addReview(id,dto,principal.getName(),orderId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @PutMapping("/review/{id}/{reviewId}")
    public ResponseEntity<Product> updateNewReview(@PathVariable String id,@PathVariable String reviewId, @RequestBody ReviewDto dto, Principal principal,@RequestParam String orderId) {
        Product result = service.updateReview(id,reviewId,dto,orderId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/review/{id}/{reviewId}")
    public ResponseEntity<Product> deleteNewReview(@PathVariable String id,@PathVariable String reviewId) {
        Product result = service.deleteReview(id,reviewId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    @GetMapping("/allProducts")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = service.getAllProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }


}
