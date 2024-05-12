package com.hcmute.tlcn.services.Impl;

import com.hcmute.tlcn.config.FileStorageProperties;
import com.hcmute.tlcn.entities.FileStorage;
import com.hcmute.tlcn.exceptions.BadRequestException;
import com.hcmute.tlcn.exceptions.NotFoundException;
import com.hcmute.tlcn.repositories.FileStorageRepository;
import com.hcmute.tlcn.services.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private final Path fileStorageLocation;
    private FileStorageRepository storageRepository;

    public FileStorageServiceImpl(FileStorageRepository storageRepository, FileStorageProperties fileStorageProperties) {
        this.storageRepository = storageRepository;
        this.fileStorageLocation = Paths.get(fileStorageProperties.getDirectory())
                .toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Override
    public byte[] getFile(String id) {
        FileStorage file = storageRepository.findByIdentifier(id).orElseThrow(() -> new BadRequestException("File not found"));
        try {
            Path filePath = this.fileStorageLocation.resolve(file.getIdentifier()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if(resource.exists()) {
                return resource.getContentAsByteArray();
            } else {
                throw new NotFoundException("File not found");
            }
        }
        catch (IOException e){
            throw new BadRequestException("File not found");
        }
    }

    @Override
    public FileStorage uploadFile(MultipartFile file) {
        try {
            String identifier = UUID.randomUUID().toString();
            Path filePath = this.fileStorageLocation.resolve(identifier).normalize();
            Files.copy(file.getInputStream(),filePath, StandardCopyOption.REPLACE_EXISTING);
            FileStorage fileStorage = new FileStorage();
            fileStorage.setIdentifier(identifier);
            fileStorage.setFileName(file.getOriginalFilename());
            fileStorage.setPath(filePath.toString());
            storageRepository.save(fileStorage);
            return fileStorage;
        }catch (IOException e){
            return null;
        }
    }
}
