package com.tiffin.management.service;

import com.tiffin.management.dto.request.AdminRegisterRequest;
import com.tiffin.management.dto.request.LoginRequest;
import com.tiffin.management.dto.request.RegisterRequest;
import com.tiffin.management.dto.response.AuthResponse;
import com.tiffin.management.entity.StudentProfile;
import com.tiffin.management.entity.User;
import com.tiffin.management.enums.Role;
import com.tiffin.management.exception.DuplicateResourceException;
import com.tiffin.management.repository.StudentProfileRepository;
import com.tiffin.management.repository.UserRepository;
import com.tiffin.management.security.CustomUserDetails;
import com.tiffin.management.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
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
        userRepository.save(user);

        StudentProfile profile = StudentProfile.builder()
                .user(user)
                .enrollmentNumber(request.getEnrollmentNumber())
                .hostelBlock(request.getHostelBlock())
                .roomNumber(request.getRoomNumber())
                .aadhaarNumber(request.getAadhaarNumber())
                .dietPreference(request.getDietPreference())
                .build();
        studentProfileRepository.save(profile);

        return buildAuthResponse(user);
    }
    @Transactional
    public AuthResponse registerAdmin(AdminRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN) // Explicitly setting ADMIN privileges
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .isActive(true)
                .build();
        userRepository.save(user);

        // Reusing your private buildAuthResponse helper to output the JWT token
        return buildAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new DuplicateResourceException("User not found"));

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        CustomUserDetails userDetails = CustomUserDetails.from(user);
        String token = jwtTokenProvider.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }
}
