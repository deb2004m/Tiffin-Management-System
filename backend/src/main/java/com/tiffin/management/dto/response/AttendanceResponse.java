package com.tiffin.management.dto.response;

import com.tiffin.management.entity.Attendance;
import com.tiffin.management.enums.AttendanceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceResponse {

    private Long id;
    private Long studentProfileId;
    private String studentName;
    private String enrollmentNumber;
    private Long menuId;
    private String menuTitle;
    private LocalDate attendanceDate;
    private AttendanceStatus status;
    private Long markedById;
    private String markedByName;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AttendanceResponse from(Attendance attendance) {
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .studentProfileId(attendance.getStudentProfile().getId())
                .studentName(attendance.getStudentProfile().getUser().getFirstName() + " "
                        + attendance.getStudentProfile().getUser().getLastName())
                .enrollmentNumber(attendance.getStudentProfile().getEnrollmentNumber())
                .menuId(attendance.getMenu().getId())
                .menuTitle(attendance.getMenu().getTitle())
                .attendanceDate(attendance.getAttendanceDate())
                .status(attendance.getStatus())
                .markedById(attendance.getMarkedBy().getId())
                .markedByName(attendance.getMarkedBy().getFirstName() + " " + attendance.getMarkedBy().getLastName())
                .remarks(attendance.getRemarks())
                .createdAt(attendance.getCreatedAt())
                .updatedAt(attendance.getUpdatedAt())
                .build();
    }
}
