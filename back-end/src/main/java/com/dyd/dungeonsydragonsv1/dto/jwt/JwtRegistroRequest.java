package com.dyd.dungeonsydragonsv1.dto.jwt;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtRegistroRequest {

    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    private String passwordConfirm;
}
