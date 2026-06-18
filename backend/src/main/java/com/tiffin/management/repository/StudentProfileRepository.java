package com.tiffin.management.repository;

import com.tiffin.management.entity.StudentProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByUserId(Long userId);

    boolean existsByEnrollmentNumber(String enrollmentNumber);

    @Query("""
            SELECT sp FROM StudentProfile sp
            JOIN sp.user u
            WHERE (:keyword IS NULL OR :keyword = '' OR
                   LOWER(u.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                   LOWER(u.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                   LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                   LOWER(sp.enrollmentNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                   LOWER(sp.hostelBlock) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """)
    Page<StudentProfile> search(@Param("keyword") String keyword, Pageable pageable);
}
