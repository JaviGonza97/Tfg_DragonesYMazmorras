package com.dyd.dungeonsydragonsv1.dto.personajes;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EquipoBack {

    private Long id;

    @NotBlank(message = "El nombre del equipo no puede estar vacío")
    private String nombre;

    @NotBlank(message = "El tipo de equipo no puede estar vacío")
    private String tipo;
}
