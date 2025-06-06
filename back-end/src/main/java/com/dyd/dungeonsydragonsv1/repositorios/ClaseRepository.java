package com.dyd.dungeonsydragonsv1.repositorios;

import com.dyd.dungeonsydragonsv1.entidades.Clase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClaseRepository extends JpaRepository<Clase, Long> {
    Optional<Clase> findByNombre(String nombre);
    boolean existsByNombre(String nombre);
}
