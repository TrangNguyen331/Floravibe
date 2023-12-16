package com.hcmute.tlcn.controllers;

import com.hcmute.tlcn.dtos.collection.CollectionDto;
import com.hcmute.tlcn.entities.Collection;
import com.hcmute.tlcn.services.CollectionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/${application.version}/collections")
public class CollectionController {

    private final CollectionService service;

    public CollectionController(CollectionService collectionService) {
        this.service = collectionService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Collection>> getAll() {
        List<Collection> result = service.getAll();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Collection> addNew(@RequestBody CollectionDto dto) {
        Collection result = service.addNew(dto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Collection> update(@PathVariable String id, @RequestBody CollectionDto dto) {
        Collection result = service.update(id, dto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Collection> delete(@PathVariable String id) {
        Collection result = service.delete(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

//    @PostMapping("/product/{id}")
//    public ResponseEntity<Collection> addNewProductToCollection(@PathVariable String id, @RequestParam String productId) {
//        Collection result = service.addProductToCollection(id,productId);
//        return new ResponseEntity<>(result, HttpStatus.OK);
//    }
//    @PutMapping("/product/{id}")
//    public ResponseEntity<Collection> removeProductInCollection(@PathVariable String id, @RequestParam String productId) {
//        Collection result = service.removeProductFromCollection(id, productId);
//        return new ResponseEntity<>(result, HttpStatus.OK);
//    }
}
