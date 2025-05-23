package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Personaje;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED)
public interface PersonajeMapper {

    // Para convertir de entidad a DTO de salida
    @Mapping(source = "raza.nombre", target = "raza")
    @Mapping(source = "clase.nombre", target = "clase")
    PersonajeFront toFront(Personaje entity);

    List<PersonajeFront> toFrontList(List<Personaje> list);

    // Para convertir entidad completa a DTO de entrada (opcional si lo necesitas)
    PersonajeBack toBack(Personaje entity);
    List<PersonajeBack> toBackList(List<Personaje> list);
}