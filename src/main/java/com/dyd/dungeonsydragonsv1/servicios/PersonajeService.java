package com.dyd.dungeonsydragonsv1.servicios;

import com.dyd.dungeonsydragonsv1.entidades.Personaje;
import com.dyd.dungeonsydragonsv1.repositorios.PersonajeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PersonajeService {

    private final PersonajeRepository personajeRepository;

    public List<Personaje> getAllPersonajes() {
        return personajeRepository.findAll();
    }

    public Personaje savePersonaje(Personaje personaje) {
        return personajeRepository.save(personaje);
    }

    public List<Personaje> saveAll(List<Personaje> personajes) { return personajeRepository.saveAll(personajes);
    }

    public List<Personaje> findAll() {return personajeRepository.findAll();
    }

    public Optional<Personaje> findById(Long id) { return personajeRepository.findById(id);
    }

    public List<Personaje> findByNombre(String nombre) {return personajeRepository.findByNombre(nombre);
    }

    public Personaje save(Personaje personaje) { return personajeRepository.save(personaje);
    }


    public List<Personaje> filtrarPorClaseYRaza(String clase, String raza) {return personajeRepository.filtrarPorClaseYRaza(clase, raza);
    }

    public boolean existsById(Long id) { return personajeRepository.existsById(id);
    }

    public void deleteById(Long id) {personajeRepository.deleteById(id);
    }
}