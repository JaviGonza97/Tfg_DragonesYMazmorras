package com.dyd.dungeonsydragonsv1.servicios;

import com.dyd.dungeonsydragonsv1.entidades.Hechizo;
import com.dyd.dungeonsydragonsv1.repositorios.HechizoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HechizoService {
    private final HechizoRepository hechizoRepository;

    public List<Hechizo> saveAll(List<Hechizo> hechizos) {
        return hechizoRepository.saveAll(hechizos);
    }
}