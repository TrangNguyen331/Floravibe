package com.hcmute.tlcn.repositories;

import com.hcmute.tlcn.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomProductRepository {
    Page<Product> getPaging(String search, Pageable pageable);
}
