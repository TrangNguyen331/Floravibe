package com.hcmute.tlcn.services.Impl;

import com.hcmute.tlcn.dtos.product.ProductDto;
import com.hcmute.tlcn.dtos.review.ReviewDto;
import com.hcmute.tlcn.entities.*;
import com.hcmute.tlcn.entities.Product;
import com.hcmute.tlcn.exceptions.NotFoundException;
import com.hcmute.tlcn.repositories.AccountRepository;
import com.hcmute.tlcn.repositories.ProductRepository;
import com.hcmute.tlcn.services.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Optional;

@Service
public class ProductServiceImpl  implements ProductService {

    private final ProductRepository repository;

    private final AccountRepository accountRepository;
    ModelMapper modelMapper = new ModelMapper();

    public ProductServiceImpl(ProductRepository repository, AccountRepository accountRepository) {
        this.repository = repository;
        this.accountRepository = accountRepository;
    }


    @Override
    public Page<Product> getPaging(String search, Pageable pageable) {
        return repository.getPaging(search,pageable);
    }

    @Override
    public Product getProductById(String id) {
        return repository.findById(id).orElseThrow(()->new NotFoundException("Product not found !!!"));
    }

    @Override
    public Product addNew(ProductDto dto) {
        Product product = new Product();
        modelMapper.map(dto,product);
        product.setImages(dto.getImages());
        product.setCollections(dto.getCollections());
        product.setTags(dto.getTags());
        repository.save(product);
        return product;
    }

    @Override
    public Product update(String id, ProductDto dto) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        modelMapper.map(dto,product);
        product.setImages(dto.getImages());
        product.setCollections(dto.getCollections());
        product.setTags(dto.getTags());
        repository.save(product);
        return product;
    }

    @Override
    public Product delete(String id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        product.setActive(false);
        repository.save(product);
        return product;
    }

    @Override
    public Product addReview(String id, ReviewDto reviewDto, String accountName) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        Review review = new Review();

        Account account=accountRepository.findByUsername(accountName).orElse(null);
        modelMapper.map(reviewDto,review);
        review.setAccount(account);
        product.getReviews().add(review);
        repository.save(product);
        return product;
    }

    @Override
    public Product updateReview(String id,String reviewId, ReviewDto reviewDto) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        Optional<Review> reviewToReplace = product.getReviews().stream()
                .filter(obj -> obj.getId().equals(reviewId))
                .findFirst();
        Review review = new Review();
        modelMapper.map(reviewDto,review);
        reviewToReplace.ifPresent(obj -> {
            // Replace the object in the list
            int index = product.getReviews().indexOf(obj);
            product.getReviews().set(index, review);
        });
        repository.save(product);
        return product;
    }

    @Override
    public Product deleteReview(String id, String reviewId) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        product.getReviews().removeIf(x->x.getId().equals(reviewId));
        repository.save(product);
        return null;
    }
}
