package com.dyd.dungeonsydragonsv1.servicios;

import com.dyd.dungeonsydragonsv1.entidades.Equipo;
import com.dyd.dungeonsydragonsv1.repositorios.EquipoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EquipoService {

    private final EquipoRepository equipoRepository;

    // Guardar un nuevo equipo si no está ya asignado a otro personaje

    public Equipo guardarEquipo(Equipo equipo) {
        if (equipo.getPersonaje() != null) {
            boolean yaAsignado = equipoRepository.findById(equipo.getId())
                    .map(e -> e.getPersonaje() != null)
                    .orElse(false);
            if (yaAsignado) {
                throw new IllegalArgumentException("Este equipo ya está asignado a un personaje.");
            }
        }
        return equipoRepository.save(equipo);
    }

    public List<Equipo> saveAll(List<Equipo> listEquipos) {
        return equipoRepository.saveAll(listEquipos);
    }

    public Optional<Equipo> findById(Long id) {
        return equipoRepository.findById(id);
    }

    public List<Equipo> getAllEquipos() {
        return equipoRepository.findAll();
    }

    public void deleteById(Long id) {
        equipoRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return equipoRepository.existsById(id);
    }
}
