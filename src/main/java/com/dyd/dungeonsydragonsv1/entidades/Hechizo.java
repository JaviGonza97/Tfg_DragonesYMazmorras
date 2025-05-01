package com.dyd.dungeonsydragonsv1.entidades;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Hechizo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String nivel; // Bajo, Medio, Alto
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "personaje_id")
    private Personaje personaje;
}
