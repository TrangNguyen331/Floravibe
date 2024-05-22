package com.hcmute.tlcn.controllers;

import com.hcmute.tlcn.entities.Wishlist;
import com.hcmute.tlcn.services.WishlistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/${application.version}/wishlist")
public class WishlistController {

    private final WishlistService service;

    public WishlistController(WishlistService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Wishlist> getWishListByUser(Principal principal){
        Wishlist result = service.getByUser(principal.getName());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    @PostMapping("/{productId}")
    public ResponseEntity<Wishlist> addProductToWishList(@PathVariable String productId, Principal principal){
        Wishlist result = service.addNew(principal.getName(),productId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    @DeleteMapping("/{productId}")
    public ResponseEntity<Wishlist> removeProductFromWishList(@PathVariable String productId,Principal principal){
        Wishlist result = service.delete(principal.getName(),productId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    @DeleteMapping("/clear")
    public ResponseEntity<Wishlist> clearWishlist(Principal principal) {
            Wishlist result = service.deleteAll(principal.getName());
            return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
