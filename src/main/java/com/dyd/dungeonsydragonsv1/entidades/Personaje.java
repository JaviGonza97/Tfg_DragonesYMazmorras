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
    private List<Equipo> equipo;

    @ManyToMany
    @JoinTable(
            name = "personaje_hechizo",
            joinColumns = @JoinColumn(name = "personaje_id"),
            inverseJoinColumns = @JoinColumn(name = "hechizo_id")
    )
    private List<Hechizo> hechizos;

    @ManyToMany
    @JoinTable(
            name = "personaje_habilidad",
            joinColumns = @JoinColumn(name = "personaje_id"),
            inverseJoinColumns = @JoinColumn(name = "habilidad_id")
    )
    private List<Habilidad> habilidades;

    @ManyToOne
    @JoinColumn(name = "usuario_personaje")
    private Usuario usuario;

}
