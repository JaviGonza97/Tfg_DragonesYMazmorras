package com.dyd.dungeonsydragonsv1.dto.personajes;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EstadisticaFront {
    // no hice estadistica de entrada es decir EstadisticaBack ya que no se crean ni editan manualmente entonces es innecesario
    private int fuerza;
    private int destreza;
    private int resistencia;
    private int magia;
}
