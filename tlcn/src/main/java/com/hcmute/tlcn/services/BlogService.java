package com.hcmute.tlcn.services;

import com.hcmute.tlcn.dtos.blog.BlogDto;
import com.hcmute.tlcn.entities.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BlogService {
    Page<Blog> getPaging(String search, Pageable pageable);

    Blog getById(String id);
    Blog addNew(BlogDto dto);

    Blog update(String id, BlogDto dto);

    Blog delete(String id);

}
