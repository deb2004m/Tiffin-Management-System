package com.tiffin.management.dto.response;

import com.tiffin.management.entity.StudentProfile;
import com.tiffin.management.enums.DietPreference;
import com.tiffin.management.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponse {

    private Long id;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private Role role;
    private Boolean isActive;
    private String enrollmentNumber;
    private String hostelBlock;
    private String roomNumber;
    private String aadhaarNumber;
    private String aadhaarDocumentPath;
    private DietPreference dietPreference;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static StudentResponse from(StudentProfile profile) {
        return StudentResponse.builder()
                .id(profile.getId())
                .userId(profile.getUser().getId())
                .email(profile.getUser().getEmail())
                .firstName(profile.getUser().getFirstName())
                .lastName(profile.getUser().getLastName())
                .phone(profile.getUser().getPhone())
                .role(profile.getUser().getRole())
                .isActive(profile.getUser().getIsActive())
                .enrollmentNumber(profile.getEnrollmentNumber())
                .hostelBlock(profile.getHostelBlock())
                .roomNumber(profile.getRoomNumber())
                .aadhaarNumber(profile.getAadhaarNumber())
                .aadhaarDocumentPath(profile.getAadhaarDocumentPath())
                .dietPreference(profile.getDietPreference())
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}
