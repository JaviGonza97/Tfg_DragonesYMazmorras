package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.enumerado.TipoEquipo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EquipoBack {

    private Long id;

    @NotBlank(message = "El nombre del equipo no puede estar vacío")
    private String nombre;

    @NotNull(message = "Debe especificar un tipo de equipo válido (ARMA, ARMADURA, OBJETO)")
    private TipoEquipo tipo;
}
