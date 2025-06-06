package com.dyd.dungeonsydragonsv1.repositorios;

import com.dyd.dungeonsydragonsv1.entidades.Raza;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RazaRepository extends JpaRepository<Raza, Long> {
    Optional<Raza> findByNombre(String nombre);
    boolean existsByNombre(String nombre);
}
