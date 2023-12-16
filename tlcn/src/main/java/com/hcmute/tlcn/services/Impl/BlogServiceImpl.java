package com.hcmute.tlcn.services.Impl;

import com.hcmute.tlcn.dtos.blog.BlogDto;
import com.hcmute.tlcn.entities.Blog;
import com.hcmute.tlcn.exceptions.NotFoundException;
import com.hcmute.tlcn.repositories.BlogRepository;
import com.hcmute.tlcn.services.BlogService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class BlogServiceImpl implements BlogService {
    private final BlogRepository repository;
    ModelMapper modelMapper = new ModelMapper();

    public BlogServiceImpl(BlogRepository repository) {
        this.repository = repository;
    }

    @Override
    public Page<Blog> getPaging(String search, Pageable pageable) {
        return repository.findAllWithSearch(search,pageable);
    }

    @Override
    public Blog getById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Not found"));
    }

    @Override
    public Blog addNew(BlogDto dto) {
        Blog blog = new Blog();
        modelMapper.map(dto,blog);
        blog.setCategory(dto.getCategory());
        repository.save(blog);
        return blog;
    }

    @Override
    public Blog update(String id, BlogDto dto) {
        Blog blog = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Not found"));
        modelMapper.map(dto,blog);
        blog.setCategory(dto.getCategory());
        repository.save(blog);
        return blog;
    }

    @Override
    public Blog delete(String id) {
        Blog blog = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Not found"));
        repository.delete(blog);
        return blog;
    }

}
