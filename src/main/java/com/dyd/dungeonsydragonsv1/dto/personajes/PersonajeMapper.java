package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Personaje;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(
        componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED
)
public interface PersonajeMapper {


    PersonajeDto toDto(Personaje entity);
    Personaje toEntity(PersonajeDto dto);

    List<PersonajeDto> toDtoList(List<Personaje> list);
    List<Personaje> toEntityList(List<PersonajeDto> list);

}
