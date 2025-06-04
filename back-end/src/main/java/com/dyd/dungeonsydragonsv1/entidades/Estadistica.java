package com.dyd.dungeonsydragonsv1.entidades;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @OneToOne(mappedBy = "estadistica", cascade = CascadeType.ALL)
    @JsonIgnore
    private Personaje personaje;
}
