package com.hcmute.tlcn.repositories;

import com.hcmute.tlcn.entities.Collection;
import com.hcmute.tlcn.entities.Review;
import com.hcmute.tlcn.entities.Wishlist;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishlistRepository extends MongoRepository<Wishlist,String> {
    Optional<Wishlist> findByUser(String user);
}
