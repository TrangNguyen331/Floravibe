package com.hcmute.tlcn.controllers;

import com.hcmute.tlcn.entities.FileStorage;
import com.hcmute.tlcn.services.FileStorageService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@RestController
@RequestMapping("/api/${application.version}/files")
public class FileController {

    private FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/viewfile/{id}")
    @ResponseBody
    public ResponseEntity<byte[]> viewFile(@PathVariable String id) {
        byte[] resource= fileStorageService.getFile(id);
        MediaType mediaType = MediaType.IMAGE_JPEG; // Default to JPEG
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline");
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(mediaType)
                .body(resource);
    }

    @PostMapping
    public ResponseEntity<List<FileStorage>> uploadFile(@RequestParam("files") MultipartFile[] files) {
        List<FileStorage> result = new ArrayList<>();
        Arrays.asList(files).stream().forEach(file -> {
            FileStorage fileStorage = fileStorageService.uploadFile(file);
            result.add(fileStorage);
        });
        return ResponseEntity.ok(result);
    }
}
