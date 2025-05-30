package com.dyd.dungeonsydragonsv1.dto.personajes;

import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PersonajeGaleriaDto {

    private Long id;
    private String nombre;
    private String raza;
    private String clase;

    private int fuerza;
    private int destreza;
    private int resistencia;
    private int magia;

    private List<String> hechizos;
    private List<String> equipo;
}

