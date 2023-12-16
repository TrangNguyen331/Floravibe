package com.hcmute.tlcn.repositories;

import com.hcmute.tlcn.entities.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends MongoRepository<Account,String> {

    @Query("{'email': {$regex: ?0, $options: 'i'}}")
    Page<Account> findPaging(String search, Pageable pageable);
    Optional<Account> findByUsername(String userName);
    Optional<Account> findByEmail(String email);

}
