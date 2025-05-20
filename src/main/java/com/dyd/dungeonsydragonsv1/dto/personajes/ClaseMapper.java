package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Clase;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(
        componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED
)
public interface ClaseMapper {

    ClaseDto toDto(Clase entity);
    Clase toEntity(ClaseDto dto);

    List<ClaseDto> toDtoList(List<Clase> list);
    List<Clase> toEntityList(List<ClaseDto> list);

}
