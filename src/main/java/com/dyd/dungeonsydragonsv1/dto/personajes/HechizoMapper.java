package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Hechizo;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(
        componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED
)
public interface HechizoMapper {

    HechizoDto toDto(Hechizo entity);
    Hechizo toEntity(HechizoDto dto);

    List<HechizoDto> toDtoList(List<Hechizo> list);
    List<Hechizo> toEntityList(List<HechizoDto> list);

}
