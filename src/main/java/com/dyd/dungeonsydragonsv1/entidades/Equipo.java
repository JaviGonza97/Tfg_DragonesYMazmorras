package com.dyd.dungeonsydragonsv1.entidades;

import com.dyd.dungeonsydragonsv1.entidades.enumerado.TipoEquipo;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Equipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEquipo tipo;

    @ManyToOne
    @JoinColumn(name = "personaje_id")
    private Personaje personaje;
}
