package com.hcmute.tlcn.repositories;

import com.hcmute.tlcn.entities.Collection;
import com.hcmute.tlcn.entities.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order,String> {
    @Query("{'additionalOrder.email': ?0}")
    List<Order> findAllByUser(String user);

    @Query("{'status': {$regex: ?0, $options: 'i'}}")
    List<Order> findAllByStatus(String status);
}
