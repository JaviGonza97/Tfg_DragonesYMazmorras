package com.dyd.dungeonsydragonsv1.servicios;

import com.dyd.dungeonsydragonsv1.entidades.Clase;
import com.dyd.dungeonsydragonsv1.entidades.Estadistica;
import com.dyd.dungeonsydragonsv1.entidades.Raza;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
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
            "PALADIN", new Estadistica(null, 2, -5, 6, 2, null),
            "HECHICERO", new Estadistica(null, -2, -2, 2, 6, null)
    );

    public Estadistica calcularEstadistica(Raza raza, Clase clase) {
        String nombreRaza = normalizar(raza.getNombre());
        String nombreClase = normalizar(clase.getNombre());

        Estadistica bonifRaza = bonificadoresPorRaza.get(nombreRaza);
        Estadistica bonifClase = bonificadoresPorClase.get(nombreClase);

        if (bonifRaza == null || bonifClase == null) {
            throw new IllegalArgumentException("No se encontraron bonificadores para la raza o clase: "
                    + raza.getNombre() + " / " + clase.getNombre());
        }

        return Estadistica.builder()
                .fuerza(bonifRaza.getFuerza() + bonifClase.getFuerza())
                .destreza(bonifRaza.getDestreza() + bonifClase.getDestreza())
                .resistencia(bonifRaza.getResistencia() + bonifClase.getResistencia())
                .magia(bonifRaza.getMagia() + bonifClase.getMagia())
                .build();
    }

    // Esto me ayuda a normalizar el texto así quito acentos y mayúsculas.

        /*📚 Referencias oficiales y útiles:
    Documentación oficial de Java SE sobre Normalizer:
    https://docs.oracle.com/javase/8/docs/api/java/text/Normalizer.html

    Explicación sobre la expresión regular [\\p{InCombiningDiacriticalMarks}]:
    Esta clase de caracteres captura todos los signos diacríticos (tildes, diéresis, etc.) que siguen a una letra base cuando el texto está en forma NFD.
    Más info sobre esto en:

    Unicode Character Categories – \p{} Syntax

    También lo puedes ver en Stack Overflow con ejemplos prácticos:
    https://stackoverflow.com/questions/15190656/remove-accents-from-a-java-string*/

    private String normalizar(String texto) {
        if (texto == null) return "";
        return Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "")
                .toUpperCase();
    }
}
