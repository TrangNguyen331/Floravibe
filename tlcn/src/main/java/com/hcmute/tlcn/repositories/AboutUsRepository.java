package com.hcmute.tlcn.repositories;

import com.hcmute.tlcn.entities.AboutUs;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AboutUsRepository extends MongoRepository<AboutUs,String> {
}
