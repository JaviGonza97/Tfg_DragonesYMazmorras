package com.dyd.dungeonsydragonsv1.dto.usuario;

import com.dyd.dungeonsydragonsv1.entidades.Usuario;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(
        componentModel = "spring",
        collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED
)
public interface UsuarioMapper {

    UsuarioDto toDto(Usuario entity);
    Usuario toEntity(UsuarioDto dto);

    List<UsuarioDto> toDtoList(List<Usuario> list);
    List<Usuario> toEntityList(List<UsuarioDto> list);

}
