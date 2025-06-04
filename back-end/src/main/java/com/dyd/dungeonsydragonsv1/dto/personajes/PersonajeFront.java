package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Equipo;
import com.dyd.dungeonsydragonsv1.entidades.Hechizo;
import com.dyd.dungeonsydragonsv1.entidades.Estadistica;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PersonajeFront {

    private Long id;
    private String nombre;
    private String raza;
    private String clase;
    private List<String> equipo;
    private List<String> hechizos;
    private Estadistica estadistica;
}
