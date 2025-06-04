package com.dyd.dungeonsydragonsv1.dto.jwt;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtLoginRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;
}
