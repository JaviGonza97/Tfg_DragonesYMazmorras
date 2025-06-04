package com.dyd.dungeonsydragonsv1.dto.personajes;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HechizoBack {

    private Long id;

    @NotBlank(message = "El nombre del hechizo no puede estar vacío")
    private String nombre;

    @NotBlank(message = "El nivel del hechizo no puede estar vacío")
    private String nivel;

    @NotBlank(message = "La descripción no puede estar vacía")
    private String descripcion;
}
