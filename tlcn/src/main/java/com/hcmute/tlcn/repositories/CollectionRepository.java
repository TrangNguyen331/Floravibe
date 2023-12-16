package com.hcmute.tlcn.repositories;

import com.hcmute.tlcn.entities.AboutUs;
import com.hcmute.tlcn.entities.Collection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CollectionRepository extends MongoRepository<Collection,String> {
}
