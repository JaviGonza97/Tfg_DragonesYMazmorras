package com.dyd.dungeonsydragonsv1.repositorios;

import com.dyd.dungeonsydragonsv1.entidades.Hechizo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;


import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class HechizoRepositoryTest {

    @Autowired
    private HechizoRepository hechizoRepo;

    @Autowired
    private TestEntityManager em;

    private Hechizo h1, h2, h3;

    @BeforeEach
    void setUp() {
        h1 = em.persist(Hechizo.builder()
                .nombre("Bola de Fuego")
                .nivel("Alto")
                .descripcion("Explosión ígnea")
                .build());
        h2 = em.persist(Hechizo.builder()
                .nombre("Escudo Mágico")
                .nivel("Bajo")
                .descripcion("Protección")
                .build());
        h3 = em.persist(Hechizo.builder()
                .nombre("Aliento de Dragón")
                .nivel("Máximo")
                .descripcion("Llamas infernales")
                .build());
        em.flush();
    }

    @Test
    @DisplayName("existsByNombre encuentra por nombre exacto")
    void testExistsByNombre() {
        boolean existe = hechizoRepo.existsByNombre("Bola de Fuego");
        assertThat(existe).isTrue();
        System.out.println("existsByNombre: Bola de Fuego: " + existe);
    }

    @Test
    // findByNombreIgnoreCase ignora mayúsculas/minúsculas
    void testFindByNombreIgnoreCase() {
        Optional<Hechizo> encontrado = hechizoRepo.findByNombreIgnoreCase("escudo mágico");
        assertThat(encontrado).isPresent();
        System.out.println("findByNombreIgnoreCase: encontrado: " + encontrado.get().getNombre());
    }

    @Test
    // findByNombreContainingIgnoreCase busca por parte del nombre
    void testFindByNombreContainingIgnoreCase() {
        List<Hechizo> lista = hechizoRepo.findByNombreContainingIgnoreCase("dragón");
        assertThat(lista).hasSize(1)
                .first().matches(h -> h.getNombre().contains("Dragón"));
        System.out.println("findByNombreContainingIgnoreCase: encontrados: "
                + lista.stream().map(Hechizo::getNombre).toList());
    }
}
