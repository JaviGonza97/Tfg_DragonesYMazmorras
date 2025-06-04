package com.dyd.dungeonsydragonsv1.dto.jwt;

import com.dyd.dungeonsydragonsv1.entidades.Usuario;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-04T17:35:03+0200",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.7 (Amazon.com Inc.)"
)
@Component
public class JwtMapperImpl implements JwtMapper {

    @Override
    public JwtRegistroResponse toRegistroResponse(Usuario usuario) {
        if ( usuario == null ) {
            return null;
        }

        JwtRegistroResponse.JwtRegistroResponseBuilder jwtRegistroResponse = JwtRegistroResponse.builder();

        jwtRegistroResponse.id( usuario.getId() );
        jwtRegistroResponse.username( usuario.getUsername() );

        return jwtRegistroResponse.build();
    }
}
