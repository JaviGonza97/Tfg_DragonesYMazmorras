package com.dyd.dungeonsydragonsv1.dto.jwt;

import com.dyd.dungeonsydragonsv1.entidades.Usuario;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED
)
public interface JwtMapper {

    JwtRegistroResponse toRegistroResponse(Usuario usuario);

    // Luego se podria apliar para mapear tammbien desde registro request a usuario.
}
