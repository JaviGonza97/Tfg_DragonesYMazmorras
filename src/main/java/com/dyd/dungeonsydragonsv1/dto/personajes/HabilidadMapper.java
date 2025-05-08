package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Habilidad;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(
        componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED
)
public interface HabilidadMapper {

    HabilidadDto toDto(Habilidad entity);
    Habilidad toEntity(HabilidadDto dto);

    List<HabilidadDto> toDtoList(List<Habilidad> list);
    List<Habilidad> toEntityList(List<HabilidadDto> list);

}
