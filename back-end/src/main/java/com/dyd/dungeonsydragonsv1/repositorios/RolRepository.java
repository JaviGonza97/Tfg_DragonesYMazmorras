package com.dyd.dungeonsydragonsv1.repositorios;

import com.dyd.dungeonsydragonsv1.entidades.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findByNombre(String nombre);
}
