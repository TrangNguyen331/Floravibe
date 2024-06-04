package com.hcmute.tlcn.repositories.impl;

import com.hcmute.tlcn.entities.Product;
import com.hcmute.tlcn.repositories.CustomProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.util.List;

import static com.hcmute.tlcn.utils.PageUtils.convertListToPage;

@Repository
public class CustomProductRepositoryImpl implements CustomProductRepository {

    private final MongoTemplate mongoTemplate;

    public CustomProductRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public Page<Product> getPaging(String search, Pageable pageable) {
        Query query=new Query();
        Criteria criteria=new Criteria();
        if(StringUtils.hasText(search)) {
            Criteria criteriaKey=Criteria.where("name").regex(".*"+search+".*","i");
//            Criteria criteriaTags = Criteria.where("tags").in(search);
//            Criteria criteriaCollection = Criteria.where("collections").in(search);
            Criteria criteriaTags = Criteria.where("tags.name").regex(".*" + search + ".*", "i");
           Criteria criteriaCollection = Criteria.where("collections.name").regex(".*" + search + ".*", "i");
            criteria = criteria.orOperator(criteriaKey,criteriaTags,criteriaCollection);
        }
        Criteria isActive= Criteria.where("isActive").is(true);
        query.addCriteria(criteria.andOperator(isActive));
        List<Product> products = mongoTemplate.find(query, Product.class);
        return convertListToPage(products,pageable);
    }

}
