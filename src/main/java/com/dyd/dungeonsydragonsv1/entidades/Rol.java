package com.dyd.dungeonsydragonsv1.entidades;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String nombre; // Ej: "ADMIN", "USUARIO"

    @ManyToMany(mappedBy = "roles")
    private Set<Usuario> usuarios;
}
