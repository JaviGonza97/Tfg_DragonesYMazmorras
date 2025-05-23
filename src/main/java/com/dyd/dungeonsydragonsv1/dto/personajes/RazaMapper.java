package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Raza;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED)
public interface RazaMapper {

    RazaBack toBack(Raza entity);
    Raza toEntity(RazaBack dto);

    RazaFront toFront(Raza entity);
    List<RazaFront> toFrontList(List<Raza> list);

    List<RazaBack> toBackList(List<Raza> list);
    List<Raza> toEntityList(List<RazaBack> list);
}
