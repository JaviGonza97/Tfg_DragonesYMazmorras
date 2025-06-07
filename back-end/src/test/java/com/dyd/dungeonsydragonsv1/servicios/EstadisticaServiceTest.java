package com.dyd.dungeonsydragonsv1.servicios;

import com.dyd.dungeonsydragonsv1.entidades.Clase;
import com.dyd.dungeonsydragonsv1.entidades.Estadistica;
import com.dyd.dungeonsydragonsv1.entidades.Raza;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EstadisticaServiceTest {

    private EstadisticaService service;

    @BeforeEach
    void setUp() {
        service = new EstadisticaService();
    }

    @Test
    @DisplayName("Calcular estadística para HUMANO + GUERRERO")
    void calculaHumanoGuerrero() {
        Raza raza = Raza.builder().nombre("Humano").build();
        Clase clase = Clase.builder().nombre("Guerrero").build();

        Estadistica stats = service.calcularEstadistica(raza, clase);

        // HUMANO (2,3,2,-3) + GUERRERO (4,3,1,-4) = (6,6,3,-7)
        assertEquals(6, stats.getFuerza());
        assertEquals(6, stats.getDestreza());
        assertEquals(3, stats.getResistencia());
        assertEquals(-7, stats.getMagia());

        System.out.println("HUMANO + GUERRERO Fuerza=" + stats.getFuerza()
                + ", Destreza=" + stats.getDestreza()
                + ", Resistencia=" + stats.getResistencia()
                + ", Magia=" + stats.getMagia());
    }

    @Test
    @DisplayName("Normalización de nombres con mayúsculas y acentos")
    void normalizarMinusculasYAcentos() {
        Raza raza = Raza.builder().nombre("enÁnO").build();
        Clase clase = Clase.builder().nombre("hechicero").build();

        // ENANO (-) + HECHICERO (6)
        Estadistica stats = service.calcularEstadistica(raza, clase);

        // ENANO (1,-3,5,1) + HECHICERO (-2,-2,2,6) = (-1,-5,7,7)
        assertEquals(-1, stats.getFuerza());
        assertEquals(-5, stats.getDestreza());
        assertEquals(7, stats.getResistencia());
        assertEquals(7, stats.getMagia());

        System.out.println("Enano + Hechicero Fuerza=" + stats.getFuerza()
                + ", Destreza=" + stats.getDestreza()
                + ", Resistencia=" + stats.getResistencia()
                + ", Magia=" + stats.getMagia());
    }

    @Test
    @DisplayName("Raza o clase no válidas lanza IllegalArgumentException")
    void razaOClaseNoValidas() {
        // aqui como esa raza goblin no existe deberia fallar ya que no existe y menos aun tiene estadisticas
        Raza desconocida = Raza.builder().nombre("Goblin").build();
        Clase rara = Clase.builder().nombre("Paladín").build();

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.calcularEstadistica(desconocida, rara));

        System.out.println("Excepción: " + ex.getMessage());
    }
}
