package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Equipo;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(
        componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED
)
public interface EquipoMapper {

    EquipoBack toBack(Equipo entity);
    Equipo toEntity(EquipoBack dto);

    EquipoFront toFront(Equipo entity);
    List<EquipoFront> toFrontList(List<Equipo> list);

    List<EquipoBack> toBackList(List<Equipo> list);
    List<Equipo> toEntityList(List<EquipoBack> list);
}
