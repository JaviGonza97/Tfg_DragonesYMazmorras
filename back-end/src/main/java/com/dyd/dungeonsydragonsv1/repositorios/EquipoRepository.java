package com.dyd.dungeonsydragonsv1.repositorios;

import com.dyd.dungeonsydragonsv1.entidades.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EquipoRepository  extends JpaRepository<Equipo, Long>{
    boolean existsByNombre(String nombre);

    List<Equipo> findByNombreContainingIgnoreCase(String nombre);

}
