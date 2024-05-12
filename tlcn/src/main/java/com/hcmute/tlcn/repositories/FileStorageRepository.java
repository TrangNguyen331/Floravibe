package com.hcmute.tlcn.repositories;

import com.hcmute.tlcn.entities.FileStorage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileStorageRepository extends MongoRepository<FileStorage, String> {
    Optional<FileStorage> findByIdentifier(String identifier);
}
