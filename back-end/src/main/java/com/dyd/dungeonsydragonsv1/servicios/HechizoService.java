package com.dyd.dungeonsydragonsv1.servicios;

import com.dyd.dungeonsydragonsv1.entidades.Hechizo;
import com.dyd.dungeonsydragonsv1.repositorios.HechizoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HechizoService {

    private final HechizoRepository hechizoRepository;


     // Guardar un hechizo nuevo, siempre y cuando no exista antes por nombre

    public Hechizo guardarSiNoExiste(Hechizo hechizo) {
        Optional<Hechizo> existente = hechizoRepository.findByNombreIgnoreCase(hechizo.getNombre());
        if (existente.isPresent()) {
            throw new IllegalArgumentException("Ya existe un hechizo con el nombre: " + hechizo.getNombre());
        }
        return hechizoRepository.save(hechizo);
    }


    // Buscar hechizo por ID

    public Optional<Hechizo> findById(Long id) {
        return hechizoRepository.findById(id);
    }


    // Obtener todos los hechizos disponibles

    public List<Hechizo> getAllHechizos() {
        return hechizoRepository.findAll();
    }


    // Guardar muchos hechizos sin validacion

    public List<Hechizo> saveAll(List<Hechizo> hechizos) {
        return hechizoRepository.saveAll(hechizos);
    }

    // busqueda por el nombre del hechizo
    public List<Hechizo> buscarPorNombre(String nombre) {
        return hechizoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public boolean existsById(Long id) {
        return hechizoRepository.existsById(id);
    }

    public void deleteById(Long id) {
        hechizoRepository.deleteById(id);
    }

    public List<Hechizo> findAllById(List<Long> ids) {
        return hechizoRepository.findAllById(ids);
    }

}
