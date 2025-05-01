package com.dyd.dungeonsydragonsv1.repositorios;

import com.dyd.dungeonsydragonsv1.entidades.Personaje;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PersonajeRepository extends JpaRepository<Personaje, Long> {
    List<Personaje> findByNombre(String nombre);

    List<Personaje> filtrarPorClaseYRaza(String clase, String raza);
}

