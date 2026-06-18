package com.tiffin.management.service;

import com.tiffin.management.dto.request.AttendanceCreateRequest;
import com.tiffin.management.dto.request.AttendanceUpdateRequest;
import com.tiffin.management.dto.response.AttendanceResponse;
import com.tiffin.management.entity.Attendance;
import com.tiffin.management.entity.Menu;
import com.tiffin.management.entity.StudentProfile;
import com.tiffin.management.entity.User;
import com.tiffin.management.exception.DuplicateResourceException;
import com.tiffin.management.exception.ResourceNotFoundException;
import com.tiffin.management.exception.UnauthorizedActionException;
import com.tiffin.management.repository.AttendanceRepository;
import com.tiffin.management.repository.MenuRepository;
import com.tiffin.management.repository.StudentProfileRepository;
import com.tiffin.management.repository.UserRepository;
import com.tiffin.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final MenuRepository menuRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendanceRecords(LocalDate date, Long studentProfileId) {
        if (SecurityUtils.isStudent()) {
            StudentProfile ownProfile = studentProfileRepository.findByUserId(SecurityUtils.getCurrentUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
            return attendanceRepository.findByStudentProfileId(ownProfile.getId()).stream()
                    .map(AttendanceResponse::from)
                    .toList();
        }

        if (studentProfileId != null) {
            return attendanceRepository.findByStudentProfileId(studentProfileId).stream()
                    .map(AttendanceResponse::from)
                    .toList();
        }
        if (date != null) {
            return attendanceRepository.findByAttendanceDate(date).stream()
                    .map(AttendanceResponse::from)
                    .toList();
        }
        return attendanceRepository.findAll().stream()
                .map(AttendanceResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public AttendanceResponse getAttendanceById(Long id) {
        Attendance attendance = findAttendanceOrThrow(id);
        assertReadAccess(attendance);
        return AttendanceResponse.from(attendance);
    }

    @Transactional
    public AttendanceResponse markAttendance(AttendanceCreateRequest request) {
        if (!SecurityUtils.isAdmin()) {
            throw new UnauthorizedActionException("Only admin can mark attendance");
        }

        StudentProfile student = studentProfileRepository.findById(request.getStudentProfileId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Menu menu = menuRepository.findById(request.getMenuId())
                .orElseThrow(() -> new ResourceNotFoundException("Menu not found"));
        User admin = userRepository.findById(SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        attendanceRepository.findByStudentProfileIdAndMenuIdAndAttendanceDate(
                request.getStudentProfileId(),
                request.getMenuId(),
                request.getAttendanceDate()
        ).ifPresent(existing -> {
            throw new DuplicateResourceException("Attendance already marked for this student, menu, and date");
        });

        Attendance attendance = Attendance.builder()
                .studentProfile(student)
                .menu(menu)
                .attendanceDate(request.getAttendanceDate())
                .status(request.getStatus())
                .markedBy(admin)
                .remarks(request.getRemarks())
                .build();

        return AttendanceResponse.from(attendanceRepository.save(attendance));
    }

    @Transactional
    public AttendanceResponse updateAttendance(Long id, AttendanceUpdateRequest request) {
        if (!SecurityUtils.isAdmin()) {
            throw new UnauthorizedActionException("Only admin can update attendance");
        }

        Attendance attendance = findAttendanceOrThrow(id);

        if (request.getStatus() != null) {
            attendance.setStatus(request.getStatus());
        }
        if (request.getRemarks() != null) {
            attendance.setRemarks(request.getRemarks());
        }

        return AttendanceResponse.from(attendanceRepository.save(attendance));
    }

    @Transactional
    public void deleteAttendance(Long id) {
        if (!SecurityUtils.isAdmin()) {
            throw new UnauthorizedActionException("Only admin can delete attendance");
        }
        Attendance attendance = findAttendanceOrThrow(id);
        attendanceRepository.delete(attendance);
    }

    private Attendance findAttendanceOrThrow(Long id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found with id: " + id));
    }

    private void assertReadAccess(Attendance attendance) {
        if (SecurityUtils.isAdmin()) {
            return;
        }
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (!attendance.getStudentProfile().getUser().getId().equals(currentUserId)) {
            throw new UnauthorizedActionException("You can only view your own attendance");
        }
    }
}
