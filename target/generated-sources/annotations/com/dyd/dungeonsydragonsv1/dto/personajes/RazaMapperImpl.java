package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Raza;
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
public class RazaMapperImpl implements RazaMapper {

    @Override
    public RazaBack toBack(Raza entity) {
        if ( entity == null ) {
            return null;
        }

        RazaBack.RazaBackBuilder razaBack = RazaBack.builder();

        razaBack.id( entity.getId() );
        razaBack.nombre( entity.getNombre() );

        return razaBack.build();
    }

    @Override
    public Raza toEntity(RazaBack dto) {
        if ( dto == null ) {
            return null;
        }

        Raza.RazaBuilder raza = Raza.builder();

        raza.id( dto.getId() );
        raza.nombre( dto.getNombre() );

        return raza.build();
    }

    @Override
    public RazaFront toFront(Raza entity) {
        if ( entity == null ) {
            return null;
        }

        RazaFront.RazaFrontBuilder razaFront = RazaFront.builder();

        razaFront.id( entity.getId() );
        razaFront.nombre( entity.getNombre() );

        return razaFront.build();
    }

    @Override
    public List<RazaFront> toFrontList(List<Raza> list) {
        if ( list == null ) {
            return null;
        }

        List<RazaFront> list1 = new ArrayList<RazaFront>( list.size() );
        for ( Raza raza : list ) {
            list1.add( toFront( raza ) );
        }

        return list1;
    }

    @Override
    public List<RazaBack> toBackList(List<Raza> list) {
        if ( list == null ) {
            return null;
        }

        List<RazaBack> list1 = new ArrayList<RazaBack>( list.size() );
        for ( Raza raza : list ) {
            list1.add( toBack( raza ) );
        }

        return list1;
    }

    @Override
    public List<Raza> toEntityList(List<RazaBack> list) {
        if ( list == null ) {
            return null;
        }

        List<Raza> list1 = new ArrayList<Raza>( list.size() );
        for ( RazaBack razaBack : list ) {
            list1.add( toEntity( razaBack ) );
        }

        return list1;
    }
}
