package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Equipo;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(
        componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED
)
public interface EquippoMapper {

    EquipoDto toDto(Equipo entity);
    Equipo toEntity(EquipoDto dto);

    List<EquipoDto> toDtoList(List<Equipo> list);
    List<Equipo> toEntityList(List<EquipoDto> list);

}
