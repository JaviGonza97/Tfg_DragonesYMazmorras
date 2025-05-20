package com.dyd.dungeonsydragonsv1.repositorios;

import com.dyd.dungeonsydragonsv1.entidades.Personaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PersonajeRepository extends JpaRepository<Personaje, Long> {

    List<Personaje> findByNombre(String nombre);

    @Query("SELECT p FROM Personaje p " +
            "WHERE p.clase.nombre = :clase " +
            "  AND p.raza.nombre  = :raza")
    List<Personaje> filtrarPorClaseYRaza(
            @Param("clase") String clase,
            @Param("raza")  String raza
    );
}
