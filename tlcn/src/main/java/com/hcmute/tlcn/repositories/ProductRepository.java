package com.hcmute.tlcn.repositories;

import com.hcmute.tlcn.entities.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product,String>, CustomProductRepository {

    List<Product> findAllByActiveIsTrue();
}
