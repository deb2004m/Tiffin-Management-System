package com.tiffin.management.entity;

import com.tiffin.management.enums.DietPreference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "enrollment_number", nullable = false, unique = true, length = 50)
    private String enrollmentNumber;

    @Column(name = "hostel_block", length = 50)
    private String hostelBlock;

    @Column(name = "room_number", length = 20)
    private String roomNumber;

    @Column(name = "aadhaar_number", length = 12)
    private String aadhaarNumber;

    @Column(name = "aadhaar_document_path", length = 500)
    private String aadhaarDocumentPath;

    @Enumerated(EnumType.STRING)
    @Column(name = "diet_preference", nullable = false, length = 20)
    @Builder.Default
    private DietPreference dietPreference = DietPreference.VEG;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
