package com.hcmute.tlcn.repositories;

import com.hcmute.tlcn.entities.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.Query;
@Repository
public interface VoucherRepository extends MongoRepository<Voucher,String> {
    @Query("{'voucherName': {$regex: ?0, $options: 'i'}}")
    Page<Voucher> getPaging(String search, Pageable pageable);
}
