package com.dyd.dungeonsydragonsv1.dto.usuario;

import com.dyd.dungeonsydragonsv1.entidades.Rol;
import com.dyd.dungeonsydragonsv1.entidades.Usuario;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-04T17:35:03+0200",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.7 (Amazon.com Inc.)"
)
@Component
public class UsuarioMapperImpl implements UsuarioMapper {

    @Override
    public UsuarioDto toDto(Usuario usuario) {
        if ( usuario == null ) {
            return null;
        }

        UsuarioDto.UsuarioDtoBuilder usuarioDto = UsuarioDto.builder();

        usuarioDto.id( usuario.getId() );
        usuarioDto.username( usuario.getUsername() );
        usuarioDto.email( usuario.getEmail() );
        usuarioDto.password( usuario.getPassword() );
        Set<Rol> set = usuario.getRoles();
        if ( set != null ) {
            usuarioDto.roles( new LinkedHashSet<Rol>( set ) );
        }

        return usuarioDto.build();
    }

    @Override
    public Usuario toEntity(UsuarioDto dto) {
        if ( dto == null ) {
            return null;
        }

        Usuario.UsuarioBuilder usuario = Usuario.builder();

        usuario.id( dto.getId() );
        usuario.username( dto.getUsername() );
        usuario.password( dto.getPassword() );
        usuario.email( dto.getEmail() );
        Set<Rol> set = dto.getRoles();
        if ( set != null ) {
            usuario.roles( new LinkedHashSet<Rol>( set ) );
        }

        return usuario.build();
    }

    @Override
    public List<UsuarioDto> toDtoList(List<Usuario> usuarios) {
        if ( usuarios == null ) {
            return null;
        }

        List<UsuarioDto> list = new ArrayList<UsuarioDto>( usuarios.size() );
        for ( Usuario usuario : usuarios ) {
            list.add( toDto( usuario ) );
        }

        return list;
    }

    @Override
    public List<Usuario> toEntityList(List<UsuarioDto> dtos) {
        if ( dtos == null ) {
            return null;
        }

        List<Usuario> list = new ArrayList<Usuario>( dtos.size() );
        for ( UsuarioDto usuarioDto : dtos ) {
            list.add( toEntity( usuarioDto ) );
        }

        return list;
    }
}
