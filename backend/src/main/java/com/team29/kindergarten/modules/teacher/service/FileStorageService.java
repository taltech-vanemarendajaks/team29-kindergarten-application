package com.team29.kindergarten.modules.teacher.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path root;

    public FileStorageService(@Value("${storage.upload-path}") String uploadPath) throws IOException {
        this.root = Paths.get(uploadPath);
        Files.createDirectories(root);
    }

    public String store(MultipartFile file) {
        validateFile(file);
        try {
            String filename = UUID.randomUUID() + "-" + sanitizeFilename(file.getOriginalFilename());
            Files.copy(file.getInputStream(), root.resolve(filename));
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");
        }

        long maxSize = 5 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is too large (max 5MB)");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only image files are allowed");
        }

        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().matches(".*\\.(png|jpg|jpeg|webp)$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file extension");
        }
    }

    private String sanitizeFilename(String filename) {
        if (filename == null) return "file";
        return filename.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
    }
}