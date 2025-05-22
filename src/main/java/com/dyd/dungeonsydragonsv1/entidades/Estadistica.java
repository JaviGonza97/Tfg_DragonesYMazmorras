package com.dyd.dungeonsydragonsv1.entidades;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Estadistica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int fuerza;
    private int destreza;
    private int resistencia;
    private int magia;

    @OneToOne(mappedBy = "estadisticas", cascade = CascadeType.ALL)
    private Personaje personaje;
}
