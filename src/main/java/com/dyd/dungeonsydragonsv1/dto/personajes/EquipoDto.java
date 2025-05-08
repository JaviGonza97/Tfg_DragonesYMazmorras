package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Personaje;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EquipoDto {

    private Long id;
    private String nombre;
    private String tipo; // Arma, Armadura, Objeto mágico
    private Personaje personaje;

}
