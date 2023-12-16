package com.hcmute.tlcn.services;

import com.hcmute.tlcn.dtos.blog.BlogDto;
import com.hcmute.tlcn.dtos.collection.CollectionDto;
import com.hcmute.tlcn.entities.Blog;
import com.hcmute.tlcn.entities.Collection;

import java.util.List;

public interface CollectionService {
    List<Collection> getAll();

    Collection addNew(CollectionDto dto);

    Collection update(String id, CollectionDto dto);

    Collection delete(String id);

//    Collection addProductToCollection(String id, String productId);
//
//    Collection removeProductFromCollection(String id, String productId);

}
