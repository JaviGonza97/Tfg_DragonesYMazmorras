package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Raza;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(
        componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED
)
public interface RazaMapper {

    RazaDto toDto(Raza entity);
    Raza toEntity(RazaDto dto);

    List<RazaDto> toDtoList(List<Raza> list);
    List<Raza> toEntityList(List<RazaDto> list);

}