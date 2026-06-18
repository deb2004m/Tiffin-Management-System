package com.tiffin.management.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminRegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password;
    @NotBlank(message = "First name is required")
    @Size(max = 80)
    private String firstName;
    @NotBlank(message = "Last name is required")
    @Size(max = 80)
    private String lastName;

    @Pattern(regexp = "^[0-9+\\- ]{7,20}$", message = "Invalid phone number")
    private String phone;
}
