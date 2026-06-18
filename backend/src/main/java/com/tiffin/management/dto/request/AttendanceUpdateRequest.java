package com.tiffin.management.dto.request;

import com.tiffin.management.enums.AttendanceStatus;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceUpdateRequest {

    private AttendanceStatus status;

    @Size(max = 255)
    private String remarks;
}
