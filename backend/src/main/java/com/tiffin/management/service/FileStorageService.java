package com.tiffin.management.service;

import com.tiffin.management.config.AppProperties;
import com.tiffin.management.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/pdf"
    );

    private final AppProperties appProperties;

    public String storeAadhaarDocument(Long studentProfileId, MultipartFile file) {
        validateFile(file);

        try {
            Path uploadDir = Paths.get(
                    appProperties.getUpload().getBaseDir(),
                    appProperties.getUpload().getAadhaarSubdir()
            );
            Files.createDirectories(uploadDir);

            String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());
            String filename = "student-" + studentProfileId + "-" + UUID.randomUUID()
                    + (extension != null ? "." + extension : "");

            Path target = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            return Paths.get(appProperties.getUpload().getAadhaarSubdir(), filename).toString().replace("\\", "/");
        } catch (IOException ex) {
            throw new BadRequestException("Failed to store Aadhaar document: " + ex.getMessage());
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Aadhaar document file is required");
        }
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new BadRequestException("Only JPEG, PNG, and PDF files are allowed");
        }
    }
}
