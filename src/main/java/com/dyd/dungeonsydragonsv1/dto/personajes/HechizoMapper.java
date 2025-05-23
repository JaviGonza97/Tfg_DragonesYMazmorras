package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Hechizo;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED)
public interface HechizoMapper {

    HechizoBack toBack(Hechizo entity);
    Hechizo toEntity(HechizoBack dto);

    HechizoFront toFront(Hechizo entity);
    List<HechizoFront> toFrontList(List<Hechizo> list);

    List<HechizoBack> toBackList(List<Hechizo> list);
    List<Hechizo> toEntityList(List<HechizoBack> list);


}
