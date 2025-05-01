package com.dyd.dungeonsydragonsv1.entidades;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Personaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String raza;
    private String clase;
    @OneToMany(mappedBy = "personaje", cascade = CascadeType.ALL)
    private List<Habilidad> habilidades;
    @OneToMany(mappedBy = "personaje", cascade = CascadeType.ALL)
    private List<Equipo> equipo;
    @OneToMany(mappedBy = "personaje", cascade = CascadeType.ALL)
    private List<Hechizo> hechizos;
}
