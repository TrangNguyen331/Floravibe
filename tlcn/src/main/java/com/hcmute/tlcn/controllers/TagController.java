package com.hcmute.tlcn.controllers;

import com.hcmute.tlcn.dtos.collection.CollectionDto;
import com.hcmute.tlcn.dtos.tag.TagDto;
import com.hcmute.tlcn.entities.Collection;
import com.hcmute.tlcn.entities.Tag;
import com.hcmute.tlcn.services.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/${application.version}/tags")
@RequiredArgsConstructor
public class TagController {
    private final TagService service;
    @GetMapping("/all")
    public ResponseEntity<List<Tag>> getAll() {
        List<Tag> result = service.getAll();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Tag> addNew(@RequestBody TagDto dto) {
        Tag result = service.addNew(dto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Tag> update(@PathVariable String id, @RequestBody TagDto dto) {
        Tag result = service.update(id, dto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Tag> delete(@PathVariable String id) {
        Tag result = service.delete(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
