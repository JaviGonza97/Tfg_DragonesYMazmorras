package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.*;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface PersonajeMapper {

    // Para la vista Front normal
    @Mapping(source = "raza.nombre", target = "raza")
    @Mapping(source = "clase.nombre", target = "clase")
    PersonajeFront toFront(Personaje entity);
    List<PersonajeFront> toFrontList(List<Personaje> list);

    // Para la Galeria PRO
    @Mapping(source = "raza.nombre", target = "raza")
    @Mapping(source = "clase.nombre", target = "clase")
    @Mapping(source = "estadistica.fuerza", target = "fuerza")
    @Mapping(source = "estadistica.destreza", target = "destreza")
    @Mapping(source = "estadistica.resistencia", target = "resistencia")
    @Mapping(source = "estadistica.magia", target = "magia")
    @Mapping(source = "hechizos", target = "hechizos")
    @Mapping(source = "equipo", target = "equipo")
    PersonajeGaleriaDto toGaleria(Personaje entity);

    List<PersonajeGaleriaDto> toGaleriaList(List<Personaje> list);

    // DTO inversos (los que ya tenías)
    PersonajeBack toBack(Personaje entity);
    List<PersonajeBack> toBackList(List<Personaje> list);
    Personaje toEntity(PersonajeBack dto);

    // Métodos auxiliares para convertir listas automáticamente:
    default List<String> mapHechizos(List<Hechizo> hechizos) {
        return hechizos == null ? List.of() : hechizos.stream()
                .map(Hechizo::getNombre)
                .collect(Collectors.toList());
    }

    default List<String> mapEquipo(List<Equipo> equipo) {
        return equipo == null ? List.of() : equipo.stream()
                .map(e -> e.getNombre() + " (" + e.getTipo() + ")")
                .collect(Collectors.toList());
    }
}
