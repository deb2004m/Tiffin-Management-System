package com.tiffin.management.config;

import com.tiffin.management.entity.User;
import com.tiffin.management.enums.Role;
import com.tiffin.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@tiffin.com")) {
            User admin = User.builder()
                    .email("admin@tiffin.com")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .firstName("System")
                    .lastName("Admin")
                    .phone("9999999999")
                    .isActive(true)
                    .build();
            userRepository.save(admin);
            log.info("Default admin user created: admin@tiffin.com / admin123");
        }
    }
}
