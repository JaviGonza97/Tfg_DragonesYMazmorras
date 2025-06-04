package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Clase;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-04T17:35:02+0200",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.7 (Amazon.com Inc.)"
)
@Component
public class ClaseMapperImpl implements ClaseMapper {

    @Override
    public ClaseBack toBack(Clase entity) {
        if ( entity == null ) {
            return null;
        }

        ClaseBack.ClaseBackBuilder claseBack = ClaseBack.builder();

        claseBack.id( entity.getId() );
        claseBack.nombre( entity.getNombre() );

        return claseBack.build();
    }

    @Override
    public Clase toEntity(ClaseBack dto) {
        if ( dto == null ) {
            return null;
        }

        Clase.ClaseBuilder clase = Clase.builder();

        clase.id( dto.getId() );
        clase.nombre( dto.getNombre() );

        return clase.build();
    }

    @Override
    public ClaseFront toFront(Clase entity) {
        if ( entity == null ) {
            return null;
        }

        ClaseFront.ClaseFrontBuilder claseFront = ClaseFront.builder();

        claseFront.id( entity.getId() );
        claseFront.nombre( entity.getNombre() );

        return claseFront.build();
    }

    @Override
    public List<ClaseFront> toFrontList(List<Clase> list) {
        if ( list == null ) {
            return null;
        }

        List<ClaseFront> list1 = new ArrayList<ClaseFront>( list.size() );
        for ( Clase clase : list ) {
            list1.add( toFront( clase ) );
        }

        return list1;
    }

    @Override
    public List<ClaseBack> toBackList(List<Clase> list) {
        if ( list == null ) {
            return null;
        }

        List<ClaseBack> list1 = new ArrayList<ClaseBack>( list.size() );
        for ( Clase clase : list ) {
            list1.add( toBack( clase ) );
        }

        return list1;
    }

    @Override
    public List<Clase> toEntityList(List<ClaseBack> list) {
        if ( list == null ) {
            return null;
        }

        List<Clase> list1 = new ArrayList<Clase>( list.size() );
        for ( ClaseBack claseBack : list ) {
            list1.add( toEntity( claseBack ) );
        }

        return list1;
    }
}
