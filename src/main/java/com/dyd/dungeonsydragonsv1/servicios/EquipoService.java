package com.dyd.dungeonsydragonsv1.servicios;

import com.dyd.dungeonsydragonsv1.entidades.Equipo;
import com.dyd.dungeonsydragonsv1.entidades.Personaje;
import com.dyd.dungeonsydragonsv1.repositorios.EquipoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.dyd.dungeonsydragonsv1.repositorios.PersonajeRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EquipoService {
    private final PersonajeRepository personajeRepository;
    private final EquipoRepository equipoRepository;

    @Transactional
    public void asignarAEquipoExistente(Long equipoId, Long personajeId) {
        Equipo equipo = equipoRepository.findById(equipoId)
                .orElseThrow(() -> new EntityNotFoundException("Equipo no encontrado"));
        Personaje personaje = personajeRepository.findById(personajeId)
                .orElseThrow(() -> new EntityNotFoundException("Personaje no encontrado"));

        equipo.setPersonaje(personaje);
        equipoRepository.save(equipo);
    }


    @Transactional
    public Equipo guardarEquipo(Equipo equipo) {
        // Si es un nuevo equipo (sin ID), simplemente lo guardamos con su personaje (puede ser null)
        if (equipo.getId() == null) {
            return equipoRepository.save(equipo);
        }

        // Si es un equipo existente, validamos que no esté asignado a otro personaje
        Equipo e = equipoRepository.findById(equipo.getId())
                .orElseThrow(() -> new EntityNotFoundException("Equipo no encontrado"));

        if (e.getPersonaje() != null
                && !e.getPersonaje().getId().equals(equipo.getPersonaje().getId())) {
            throw new IllegalArgumentException("Este equipo ya está asignado a un personaje.");
        }

        e.setPersonaje(equipo.getPersonaje());
        return equipoRepository.save(e);
    }


    public List<Equipo> buscarPorNombre(String nombre) {
        return equipoRepository.findByNombreContainingIgnoreCase(nombre);
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

    public List<Equipo> findAllById(List<Long> ids) {
        return equipoRepository.findAllById(ids);
    }
}
