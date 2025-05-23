package com.dyd.dungeonsydragonsv1.dto.personajes;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PersonajeBack {

    private Long id;

    @NotNull(message = "El nombre no puede ser nulo")
    @Size(min = 2, message = "El nombre debe tener al menos 2 caracteres")
    private String nombre;

    @NotNull(message = "Debe seleccionar una raza")
    private Long razaId;

    @NotNull(message = "Debe seleccionar una clase")
    private Long claseId;

    private List<Long> equipoIds;

    private List<Long> hechizoIds;
}