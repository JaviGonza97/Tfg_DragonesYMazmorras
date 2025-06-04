package com.dyd.dungeonsydragonsv1.dto.jwt;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JwtRegistroResponse {
    private Long id;
    private String username;
    private LocalDateTime fechaAlta;
}
