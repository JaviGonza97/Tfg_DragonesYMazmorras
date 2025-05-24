package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Clase;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ClaseMapper {

    ClaseBack toBack(Clase entity);
    Clase toEntity(ClaseBack dto);

    ClaseFront toFront(Clase entity);
    List<ClaseFront> toFrontList(List<Clase> list);

    List<ClaseBack> toBackList(List<Clase> list);
    List<Clase> toEntityList(List<ClaseBack> list);
}
