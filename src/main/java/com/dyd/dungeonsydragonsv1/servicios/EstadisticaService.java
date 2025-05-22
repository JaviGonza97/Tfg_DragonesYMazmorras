package com.dyd.dungeonsydragonsv1.servicios;

import com.dyd.dungeonsydragonsv1.entidades.Clase;
import com.dyd.dungeonsydragonsv1.entidades.Estadistica;
import com.dyd.dungeonsydragonsv1.entidades.Raza;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EstadisticaService {

    // Mapas con valores fijos por RAZA
    private static final Map<String, Estadistica> bonificadoresPorRaza = Map.of(
            "HUMANO", new Estadistica(null, 2, 3, 2, -3, null),
            "ORCO", new Estadistica(null, 3, -1, 3, 0, null),
            "ENANO", new Estadistica(null, 1, -3, 5, 1, null),
            "ELFO", new Estadistica(null, -2, 2, 0, 4, null),
            "DRAGON", new Estadistica(null, 3, -2, 0, 4, null)
    );

    // Mapas con valores fijos por CLASE
    private static final Map<String, Estadistica> bonificadoresPorClase = Map.of(
            "GUERRERO", new Estadistica(null, 4, 3, 1, -4, null),
            "PALADÍN", new Estadistica(null, 2, -5, 6, 2, null),
            "HECHICERO", new Estadistica(null, -2, -2, 2, 6, null)
    );

    public Estadistica calcularEstadistica(Raza raza, Clase clase) {
        Estadistica bonifRaza = bonificadoresPorRaza.get(raza.getNombre().toUpperCase());
        Estadistica bonifClase = bonificadoresPorClase.get(clase.getNombre().toUpperCase());

        if (bonifRaza == null || bonifClase == null) {
            throw new IllegalArgumentException("No se encontraron bonificadores para la raza o clase");
        }

        return Estadistica.builder()
                .fuerza(bonifRaza.getFuerza() + bonifClase.getFuerza())
                .destreza(bonifRaza.getDestreza() + bonifClase.getDestreza())
                .resistencia(bonifRaza.getResistencia() + bonifClase.getResistencia())
                .magia(bonifRaza.getMagia() + bonifClase.getMagia())
                .build();
    }
}
