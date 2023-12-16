package com.hcmute.tlcn.controllers;


import com.hcmute.tlcn.dtos.blog.BlogDto;
import com.hcmute.tlcn.entities.Blog;
import com.hcmute.tlcn.services.BlogService;
import com.hcmute.tlcn.utils.PageUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/${application.version}/blogs")
public class BlogController {
    private final BlogService service;
    public BlogController(BlogService service) {
        this.service = service;
    }

    @GetMapping("/paging")
    public ResponseEntity<Page<Blog>> getPaging(
            @RequestParam(name = "search", required = false, defaultValue = "") String search,
            @RequestParam(name = "page", required = false, defaultValue = "${application.default.paging.page}") int page,
            @RequestParam(name = "size", required = false, defaultValue = "${application.default.paging.size}") int size,
            @RequestParam(name = "sort", required = false, defaultValue = "DESC") String sort,
            @RequestParam(name = "column", required = false, defaultValue = "createdDate") String sortColumn) {
        Pageable pageable = PageUtils.createPageable(page, size, sort, sortColumn);
        Page<Blog> result = service.getPaging(search,pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Blog> getById(@PathVariable String id) {
        Blog result = service.getById(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<Blog> addNew(@RequestBody BlogDto dto) {
        Blog result = service.addNew(dto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Blog> update(@PathVariable String id, @RequestBody BlogDto dto) {
        Blog result = service.update(id, dto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Blog> delete(@PathVariable String id) {
        Blog result = service.delete(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
