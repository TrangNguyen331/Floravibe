package com.hcmute.tlcn.services;

import com.hcmute.tlcn.entities.FileStorage;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    byte[] getFile(String id);
    FileStorage uploadFile(MultipartFile file);
}
