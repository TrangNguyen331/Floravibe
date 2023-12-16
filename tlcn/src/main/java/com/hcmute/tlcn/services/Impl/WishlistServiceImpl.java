package com.hcmute.tlcn.services.Impl;

import com.hcmute.tlcn.entities.Product;
import com.hcmute.tlcn.entities.Wishlist;
import com.hcmute.tlcn.exceptions.NotFoundException;
import com.hcmute.tlcn.repositories.ProductRepository;
import com.hcmute.tlcn.repositories.WishlistRepository;
import com.hcmute.tlcn.services.WishlistService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository repository;
    private final ProductRepository productRepository;

    public WishlistServiceImpl(WishlistRepository repository, ProductRepository productRepository) {
        this.repository = repository;
        this.productRepository = productRepository;
    }

    @Override
    public Wishlist getByUser(String user) {
        Optional<Wishlist> wishlist=  repository.findByUser(user);
        if(wishlist.isEmpty()){
            Wishlist userWishList = new Wishlist();
            userWishList.setUser(user);
            repository.save(userWishList);
            return userWishList;
        }
        return wishlist.get();
    }

    @Override
    public Wishlist addNew(String user, String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(()->new NotFoundException("Product not found"));
        Optional<Wishlist> wishlist=  repository.findByUser(user);
        if(wishlist.isEmpty()){
            Wishlist userWishList = new Wishlist();
            userWishList.setUser(user);
            userWishList.getProducts().add(product);
            repository.save(userWishList);
            return userWishList;
        }
        else {
            Wishlist userWishList = wishlist.get();
            boolean exists = userWishList.getProducts().stream()
                    .anyMatch(obj -> obj.getId().equals(productId));
            if (!exists) {
                wishlist.get().getProducts().add(product);
            }
            repository.save(userWishList);
            return userWishList;
        }
    }

    @Override
    public Wishlist delete(String user, String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(()->new NotFoundException("Product not found"));
        Optional<Wishlist> wishlist=  repository.findByUser(user);
        if(wishlist.isPresent()){
            Wishlist userWishList = wishlist.get();
            userWishList.getProducts().removeIf(x->x.getId().equals(productId));
            repository.save(userWishList);
            return userWishList;
        }
        else {
            Wishlist userWishList = new Wishlist();
            userWishList.setUser(user);
            repository.save(userWishList);
            return userWishList;
        }
    }
}
