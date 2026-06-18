package com.tiffin.management.dto.request;

import com.tiffin.management.enums.DietPreference;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentUpdateRequest {

    @Size(max = 80)
    private String firstName;

    @Size(max = 80)
    private String lastName;

    @Pattern(regexp = "^[0-9+\\- ]{7,20}$", message = "Invalid phone number")
    private String phone;

    @Size(max = 50)
    private String hostelBlock;

    @Size(max = 20)
    private String roomNumber;

    @Pattern(regexp = "^[0-9]{12}$", message = "Aadhaar number must be 12 digits")
    private String aadhaarNumber;

    private DietPreference dietPreference;

    private Boolean isActive;
}
