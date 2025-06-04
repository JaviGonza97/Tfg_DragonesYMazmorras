package com.dyd.dungeonsydragonsv1.dto.jwt;

import com.dyd.dungeonsydragonsv1.entidades.Rol;
import lombok.*;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JwtLoginResponse {
    private String token;

    @Builder.Default
    private String tokenType = "Bearer";

    private String username;

    private Set<Rol> roles;
}
