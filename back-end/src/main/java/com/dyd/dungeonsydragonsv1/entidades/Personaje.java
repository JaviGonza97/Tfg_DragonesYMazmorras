package com.dyd.dungeonsydragonsv1.entidades;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
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
    @JoinColumn(name = "raza_id")
    private Raza raza;

    @ManyToOne
    @JoinColumn(name = "clase_id")
    private Clase clase;

    @OneToMany(mappedBy = "personaje", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Equipo> equipo = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "personaje_hechizo",
            joinColumns = @JoinColumn(name = "personaje_id"),
            inverseJoinColumns = @JoinColumn(name = "hechizo_id")
    )
    private List<Hechizo> hechizos;

    @ManyToOne
    @JoinColumn(name = "usuario_personaje")
    private Usuario usuario;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "estadistica_id")
    private Estadistica estadistica;

    public void addEquipo(Equipo e) {
        e.setPersonaje(this);
        this.equipo.add(e);
    }

    public void removeEquipo(Equipo e) {
        e.setPersonaje(null);
        this.equipo.remove(e);
    }
}
