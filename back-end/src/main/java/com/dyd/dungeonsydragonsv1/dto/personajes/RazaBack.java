package com.dyd.dungeonsydragonsv1.dto.personajes;

import jakarta.validation.constraints.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RazaBack {

    // En principio esto no se usara por que no haremos cambios de raza ni agregaremos ningun tipo de raza mas o cambios.

    private Long id;

    @NotNull(message = "El nombre de la raza no puede ser nulo")
    @Size(min = 2, message = "El nombre de la raza debe tener al menos 2 caracteres")
    private String nombre;
}