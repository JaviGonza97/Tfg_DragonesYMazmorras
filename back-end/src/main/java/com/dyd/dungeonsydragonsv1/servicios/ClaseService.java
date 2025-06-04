package com.dyd.dungeonsydragonsv1.servicios;

import com.dyd.dungeonsydragonsv1.entidades.Clase;
import com.dyd.dungeonsydragonsv1.repositorios.ClaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClaseService {

    private final ClaseRepository claseRepository;

    public List<Clase> getAllClases() {
        return claseRepository.findAll();
    }

    public Optional<Clase> findById(Long id) {
        return claseRepository.findById(id);
    }

    public Clase saveClase(Clase clase) {
        return claseRepository.save(clase);
    }

    public List<Clase> saveAll(List<Clase> clases) {
        return claseRepository.saveAll(clases);
    }

    public boolean existsById(Long id) {
        return claseRepository.existsById(id);
    }

    public void deleteById(Long id) {
        claseRepository.deleteById(id);
    }
}