package com.tiffin.management.repository;

import com.tiffin.management.entity.Attendance;
import com.tiffin.management.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentProfileId(Long studentProfileId);

    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);

    Optional<Attendance> findByStudentProfileIdAndMenuIdAndAttendanceDate(
            Long studentProfileId,
            Long menuId,
            LocalDate attendanceDate
    );

    @Query("""
            SELECT COUNT(a) FROM Attendance a
            WHERE a.attendanceDate = :date AND a.status = :status
            """)
    long countByDateAndStatus(@Param("date") LocalDate date, @Param("status") AttendanceStatus status);
}
