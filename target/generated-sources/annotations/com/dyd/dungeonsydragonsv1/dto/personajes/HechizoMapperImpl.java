package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Hechizo;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-04T17:35:03+0200",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.7 (Amazon.com Inc.)"
)
@Component
public class HechizoMapperImpl implements HechizoMapper {

    @Override
    public HechizoBack toBack(Hechizo entity) {
        if ( entity == null ) {
            return null;
        }

        HechizoBack.HechizoBackBuilder hechizoBack = HechizoBack.builder();

        hechizoBack.id( entity.getId() );
        hechizoBack.nombre( entity.getNombre() );
        hechizoBack.nivel( entity.getNivel() );
        hechizoBack.descripcion( entity.getDescripcion() );

        return hechizoBack.build();
    }

    @Override
    public Hechizo toEntity(HechizoBack dto) {
        if ( dto == null ) {
            return null;
        }

        Hechizo.HechizoBuilder hechizo = Hechizo.builder();

        hechizo.id( dto.getId() );
        hechizo.nombre( dto.getNombre() );
        hechizo.nivel( dto.getNivel() );
        hechizo.descripcion( dto.getDescripcion() );

        return hechizo.build();
    }

    @Override
    public HechizoFront toFront(Hechizo entity) {
        if ( entity == null ) {
            return null;
        }

        HechizoFront.HechizoFrontBuilder hechizoFront = HechizoFront.builder();

        hechizoFront.id( entity.getId() );
        hechizoFront.nombre( entity.getNombre() );
        hechizoFront.nivel( entity.getNivel() );
        hechizoFront.descripcion( entity.getDescripcion() );

        return hechizoFront.build();
    }

    @Override
    public List<HechizoFront> toFrontList(List<Hechizo> list) {
        if ( list == null ) {
            return null;
        }

        List<HechizoFront> list1 = new ArrayList<HechizoFront>( list.size() );
        for ( Hechizo hechizo : list ) {
            list1.add( toFront( hechizo ) );
        }

        return list1;
    }

    @Override
    public List<HechizoBack> toBackList(List<Hechizo> list) {
        if ( list == null ) {
            return null;
        }

        List<HechizoBack> list1 = new ArrayList<HechizoBack>( list.size() );
        for ( Hechizo hechizo : list ) {
            list1.add( toBack( hechizo ) );
        }

        return list1;
    }

    @Override
    public List<Hechizo> toEntityList(List<HechizoBack> list) {
        if ( list == null ) {
            return null;
        }

        List<Hechizo> list1 = new ArrayList<Hechizo>( list.size() );
        for ( HechizoBack hechizoBack : list ) {
            list1.add( toEntity( hechizoBack ) );
        }

        return list1;
    }
}
