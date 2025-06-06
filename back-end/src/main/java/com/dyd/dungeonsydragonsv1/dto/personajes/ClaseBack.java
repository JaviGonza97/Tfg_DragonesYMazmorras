package com.dyd.dungeonsydragonsv1.dto.personajes;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClaseBack {

    private Long id;

    @NotNull(message = "El nombre de la clase no puede ser nulo")
    @Size(min = 2, message = "El nombre de la clase debe tener al menos 2 caracteres")
    private String nombre;
}
