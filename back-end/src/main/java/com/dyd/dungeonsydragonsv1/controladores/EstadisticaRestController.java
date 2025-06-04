package com.dyd.dungeonsydragonsv1.controladores;

import com.dyd.dungeonsydragonsv1.dto.personajes.EstadisticaFront;
import com.dyd.dungeonsydragonsv1.dto.personajes.EstadisticaMapper;
import com.dyd.dungeonsydragonsv1.entidades.Personaje;
import com.dyd.dungeonsydragonsv1.servicios.PersonajeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/estadisticas")
@RequiredArgsConstructor
public class EstadisticaRestController {

    private final PersonajeService personajeService;
    private final EstadisticaMapper estadisticaMapper;

    // te devuelve la estadistica del personaje por el id
    @GetMapping("/{personajeId}")
    public ResponseEntity<EstadisticaFront> obtenerEstadisticas(@PathVariable Long personajeId) {
        return personajeService.findById(personajeId)
                .map(Personaje::getEstadistica)
                .map(estadisticaMapper::toFront)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Aqui puedes buscar las estadisticas por nombre del personaje
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<EstadisticaFront> obtenerPorNombrePersonaje(@PathVariable String nombre) {
        return personajeService.findByNombre(nombre).stream()
                .findFirst()
                .map(Personaje::getEstadistica)
                .map(estadisticaMapper::toFront)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


}
