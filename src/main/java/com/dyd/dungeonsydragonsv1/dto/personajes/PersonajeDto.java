package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonajeDto {

    private Long id;
    private String nombre;
    private Raza raza;
    private Clase clase;
    private List<Habilidad> habilidades;
    private List<Equipo> equipo;
    private List<Hechizo> hechizos;

}
