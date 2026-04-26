package com.team29.kindergarten.modules.teacher.controller;

import com.team29.kindergarten.modules.teacher.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileStorageService storageService;

    @PostMapping("/photo")
    public String uploadPhoto(@RequestParam("file") MultipartFile file) {
        return storageService.store(file);
    }
}
