package com.hcmute.tlcn.repositories;

import com.hcmute.tlcn.entities.AboutUs;
import com.hcmute.tlcn.entities.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogRepository extends MongoRepository<Blog,String> {

    @Query("{'title': {$regex: ?0, $options: 'i'}}")
    Page<Blog> findAllWithSearch(String search, Pageable pageable);
}
