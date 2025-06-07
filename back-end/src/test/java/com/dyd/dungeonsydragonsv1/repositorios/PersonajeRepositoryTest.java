package com.dyd.dungeonsydragonsv1.repositorios;

import com.dyd.dungeonsydragonsv1.entidades.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class PersonajeRepositoryTest {

    @Autowired
    private PersonajeRepository personajeRepo;

    @Autowired
    private TestEntityManager em;

    private Usuario usuario;
    private Raza raza;
    private Clase claseGuerrero;
    private Clase claseHechicero;
    private Personaje p1, p2;

    @BeforeEach
    void setUp() {
        // Persistimos un usuario
        usuario = em.persist(Usuario.builder()
                .username("usuario1")
                .email("u1@dyd.com")
                .password("pass")
                .build());

        // Persistimos Raza y dos Clases
        raza = em.persist(Raza.builder().nombre("Enano").build());
        claseGuerrero = em.persist(Clase.builder().nombre("Guerrero").build());
        claseHechicero = em.persist(Clase.builder().nombre("Hechicero").build());

        em.flush();  // forzamos INSERTs para generar IDs

        // Creamos y persistimos dos personajes
        p1 = em.persist(Personaje.builder()
                .nombre("Thorin")
                .raza(raza)
                .clase(claseGuerrero)
                .usuario(usuario)
                .build());

        p2 = em.persist(Personaje.builder()
                .nombre("Elrond")
                .raza(raza)
                .clase(claseHechicero)
                .usuario(usuario)
                .build());

        em.flush();
    }

    @Test
    @DisplayName("findByNombre devuelve la lista correcta")
    void testFindByNombre() {
        List<Personaje> resultado = personajeRepo.findByNombre("Thorin");
        assertThat(resultado)
                .hasSize(1)
                .first().matches(p -> p.getNombre().equals("Thorin"));
        System.out.println("findByNombre: encontrado: " + resultado.get(0).getNombre());
    }

    @Test
    // "filtrarPorClaseYRaza con JPQL funciona"
    void testFiltrarPorClaseYRaza() {
        List<Personaje> resultado = personajeRepo.filtrarPorClaseYRaza("Guerrero", "Enano");
        assertThat(resultado)
                .hasSize(1)
                .first().matches(p -> p.getNombre().equals("Thorin"));
        System.out.println("filtrarPorClaseYRaza: encontrado: " + resultado.get(0).getNombre());
    }

    @Test
    @DisplayName("findByUsuario devuelve todos los personajes del usuario")
    void testFindByUsuario() {
        List<Personaje> resultado = personajeRepo.findByUsuario(usuario);
        assertThat(resultado).hasSize(2);
        System.out.println("findByUsuario: encontrados: "
                + resultado.stream().map(Personaje::getNombre).collect(Collectors.toList()));
    }
}
