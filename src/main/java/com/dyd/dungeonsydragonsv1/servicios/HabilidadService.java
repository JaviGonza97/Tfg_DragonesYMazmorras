package com.dyd.dungeonsydragonsv1.servicios;

import com.dyd.dungeonsydragonsv1.entidades.Habilidad;
import com.dyd.dungeonsydragonsv1.repositorios.HabilidadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HabilidadService {

    private final HabilidadRepository habilidadRepository;

    public List<Habilidad> saveAll(List<Habilidad> habilidades) {
        return habilidadRepository.saveAll(habilidades);
    }
}