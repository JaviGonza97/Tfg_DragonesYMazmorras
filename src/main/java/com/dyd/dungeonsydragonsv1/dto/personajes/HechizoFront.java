package com.dyd.dungeonsydragonsv1.dto.personajes;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HechizoFront {

    private Long id;
    private String nombre;
    private String nivel;
    private String descripcion;
}
