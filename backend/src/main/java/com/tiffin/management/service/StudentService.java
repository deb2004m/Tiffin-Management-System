package com.tiffin.management.service;

import com.tiffin.management.dto.request.StudentCreateRequest;
import com.tiffin.management.dto.request.StudentUpdateRequest;
import com.tiffin.management.dto.response.PagedResponse;
import com.tiffin.management.dto.response.StudentResponse;
import com.tiffin.management.entity.StudentProfile;
import com.tiffin.management.entity.User;
import com.tiffin.management.enums.Role;
import com.tiffin.management.exception.DuplicateResourceException;
import com.tiffin.management.exception.ResourceNotFoundException;
import com.tiffin.management.exception.UnauthorizedActionException;
import com.tiffin.management.repository.StudentProfileRepository;
import com.tiffin.management.repository.UserRepository;
import com.tiffin.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public PagedResponse<StudentResponse> searchStudents(String keyword, Pageable pageable) {
        assertAdmin();
        Page<StudentResponse> page = studentProfileRepository.search(keyword, pageable)
                .map(StudentResponse::from);
        return PagedResponse.from(page);
    }

    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        StudentProfile profile = findStudentOrThrow(id);
        assertAccess(profile);
        return StudentResponse.from(profile);
    }

    @Transactional(readOnly = true)
    public StudentResponse getCurrentStudentProfile() {
        StudentProfile profile = studentProfileRepository.findByUserId(SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return StudentResponse.from(profile);
    }

    @Transactional
    public StudentResponse createStudent(StudentCreateRequest request) {
        assertAdmin();

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already registered");
        }
        if (studentProfileRepository.existsByEnrollmentNumber(request.getEnrollmentNumber())) {
            throw new DuplicateResourceException("Enrollment number already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .isActive(true)
                .build();

        user = userRepository.save(user);

        StudentProfile profile = StudentProfile.builder()
                .user(user)
                .enrollmentNumber(request.getEnrollmentNumber())
                .hostelBlock(request.getHostelBlock())
                .roomNumber(request.getRoomNumber())
                .aadhaarNumber(request.getAadhaarNumber())
                .dietPreference(request.getDietPreference())
                .build();

        return StudentResponse.from(studentProfileRepository.save(profile));
    }

    @Transactional
    public StudentResponse updateStudent(Long id, StudentUpdateRequest request) {
        StudentProfile profile = findStudentOrThrow(id);
        assertAccess(profile);

        User user = profile.getUser();
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getIsActive() != null) {
            if (!SecurityUtils.isAdmin()) {
                throw new UnauthorizedActionException("Only admin can change active status");
            }
            user.setIsActive(request.getIsActive());
        }
        if (request.getHostelBlock() != null) {
            profile.setHostelBlock(request.getHostelBlock());
        }
        if (request.getRoomNumber() != null) {
            profile.setRoomNumber(request.getRoomNumber());
        }
        if (request.getAadhaarNumber() != null) {
            profile.setAadhaarNumber(request.getAadhaarNumber());
        }
        if (request.getDietPreference() != null) {
            profile.setDietPreference(request.getDietPreference());
        }

        userRepository.save(user);
        return StudentResponse.from(studentProfileRepository.save(profile));
    }

    @Transactional
    public void deleteStudent(Long id) {
        assertAdmin();
        StudentProfile profile = findStudentOrThrow(id);
        studentProfileRepository.delete(profile);
    }

    @Transactional
    public StudentResponse uploadAadhaarDocument(Long id, MultipartFile file) {
        StudentProfile profile = findStudentOrThrow(id);
        assertAccess(profile);

        String path = fileStorageService.storeAadhaarDocument(profile.getId(), file);
        profile.setAadhaarDocumentPath(path);
        return StudentResponse.from(studentProfileRepository.save(profile));
    }

    private StudentProfile findStudentOrThrow(Long id) {
        return studentProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    private void assertAdmin() {
        if (!SecurityUtils.isAdmin()) {
            throw new UnauthorizedActionException("Admin access required");
        }
    }

    private void assertAccess(StudentProfile profile) {
        if (SecurityUtils.isAdmin()) {
            return;
        }
        if (!profile.getUser().getId().equals(SecurityUtils.getCurrentUserId())) {
            throw new UnauthorizedActionException("You can only access your own profile");
        }
    }
}
