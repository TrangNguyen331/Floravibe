package com.hcmute.tlcn.services.Impl;

import com.hcmute.tlcn.dtos.collection.CollectionDto;
import com.hcmute.tlcn.entities.Collection;
import com.hcmute.tlcn.entities.Product;
import com.hcmute.tlcn.exceptions.NotFoundException;
import com.hcmute.tlcn.repositories.CollectionRepository;
import com.hcmute.tlcn.repositories.ProductRepository;
import com.hcmute.tlcn.services.CollectionService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CollectionServiceImpl implements CollectionService {
    private final CollectionRepository repository;
    private final ProductRepository productRepository;
    ModelMapper modelMapper = new ModelMapper();

    public CollectionServiceImpl(CollectionRepository repository, ProductRepository productRepository) {
        this.repository = repository;
        this.productRepository = productRepository;
    }

    @Override
    public List<Collection> getAll() {
        return repository.findAll();
    }

    @Override
    public Collection addNew(CollectionDto dto) {
        Collection collection = new Collection();
        modelMapper.map(dto,collection);
        repository.save(collection);
        return collection;
    }

    @Override
    public Collection update(String id, CollectionDto dto) {
        Collection collection = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Collection not found"));
        modelMapper.map(dto,collection);
        repository.save(collection);
        return collection;
    }

    @Override
    public Collection delete(String id) {
        Collection collection = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Collection not found"));
        repository.delete(collection);
        return collection;
    }

//    @Override
//    public Collection addProductToCollection(String id, String productId) {
//        Collection collection = repository.findById(id)
//                .orElseThrow(() -> new NotFoundException("Collection not found"));
//        Product product = productRepository.findById(productId)
//                .orElseThrow(() -> new NotFoundException("Product not found"));
//        Optional<Product> verifyProduct = collection.getProducts().parallelStream().filter(x->x.getId().equals(productId)).findFirst();
//        if(verifyProduct.isEmpty()){
//            collection.getProducts().add(product);
//            repository.save(collection);
//        }
//        return collection;
//    }
//
//    @Override
//    public Collection removeProductFromCollection(String id, String productId) {
//        Collection collection = repository.findById(id)
//                .orElseThrow(() -> new NotFoundException("Collection not found"));
//        Product product = productRepository.findById(productId)
//                .orElseThrow(() -> new NotFoundException("Product not found"));
//        collection.getProducts().removeIf(x->x.getId().equals(productId));
//        repository.save(collection);
//        return collection;
//    }
}
