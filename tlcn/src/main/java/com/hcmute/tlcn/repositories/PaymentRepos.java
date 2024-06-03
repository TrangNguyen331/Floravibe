package com.hcmute.tlcn.repositories;

import com.hcmute.tlcn.entities.Payments;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepos extends MongoRepository<Payments, String>{
    Optional<Payments> findByOrderId(String orderId);
}
