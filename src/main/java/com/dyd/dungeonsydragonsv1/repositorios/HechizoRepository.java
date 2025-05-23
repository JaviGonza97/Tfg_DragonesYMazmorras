package com.dyd.dungeonsydragonsv1.repositorios;

import com.dyd.dungeonsydragonsv1.entidades.Hechizo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface HechizoRepository extends JpaRepository<Hechizo, Long> {

    Optional<Hechizo> findByNombreIgnoreCase(String nombre);

}
