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

    @ManyToOne
    @JoinColumn(name = "raza_personaje")
    private Raza raza;

    @ManyToOne
    @JoinColumn(name = "clase_personaje")
    private Clase clase;

    @OneToMany(mappedBy = "personaje", cascade = CascadeType.ALL)
    private List<Habilidad> habilidades;

    @OneToMany(mappedBy = "personaje", cascade = CascadeType.ALL)
    private List<Equipo> equipo;

    @OneToMany(mappedBy = "personaje", cascade = CascadeType.ALL)
    private List<Hechizo> hechizos;
}
