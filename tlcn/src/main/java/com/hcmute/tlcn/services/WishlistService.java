package com.hcmute.tlcn.services;

import com.hcmute.tlcn.dtos.blog.BlogDto;
import com.hcmute.tlcn.entities.Blog;
import com.hcmute.tlcn.entities.Wishlist;

public interface WishlistService {
    Wishlist getByUser(String user);
    Wishlist addNew(String user, String productId);

    Wishlist delete(String user, String productId);
    Wishlist deleteAll(String user);
}
