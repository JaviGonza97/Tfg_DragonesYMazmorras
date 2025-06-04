package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.enumerado.TipoEquipo;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EquipoFront {

    private Long id;
    private String nombre;
    private TipoEquipo tipo;
}
