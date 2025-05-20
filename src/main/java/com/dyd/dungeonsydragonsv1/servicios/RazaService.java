package com.dyd.dungeonsydragonsv1.servicios;

import com.dyd.dungeonsydragonsv1.entidades.Raza;
import com.dyd.dungeonsydragonsv1.repositorios.RazaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RazaService {

    private final RazaRepository razaRepository;

    public List<Raza> getAllRazas() {
        return razaRepository.findAll();
    }

    public Optional<Raza> findById(Long id) {
        return razaRepository.findById(id);
    }

    public Raza saveRaza(Raza raza) {
        return razaRepository.save(raza);
    }

    public List<Raza> saveAll(List<Raza> razas) {
        return razaRepository.saveAll(razas);
    }

    public boolean existsById(Long id) {
        return razaRepository.existsById(id);
    }

    public void deleteById(Long id) {
        razaRepository.deleteById(id);
    }
}
