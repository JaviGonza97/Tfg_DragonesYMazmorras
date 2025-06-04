package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Equipo;
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
public class EquipoMapperImpl implements EquipoMapper {

    @Override
    public EquipoBack toBack(Equipo entity) {
        if ( entity == null ) {
            return null;
        }

        EquipoBack.EquipoBackBuilder equipoBack = EquipoBack.builder();

        equipoBack.id( entity.getId() );
        equipoBack.nombre( entity.getNombre() );
        equipoBack.tipo( entity.getTipo() );

        return equipoBack.build();
    }

    @Override
    public Equipo toEntity(EquipoBack dto) {
        if ( dto == null ) {
            return null;
        }

        Equipo.EquipoBuilder equipo = Equipo.builder();

        equipo.id( dto.getId() );
        equipo.nombre( dto.getNombre() );
        equipo.tipo( dto.getTipo() );

        return equipo.build();
    }

    @Override
    public EquipoFront toFront(Equipo entity) {
        if ( entity == null ) {
            return null;
        }

        EquipoFront.EquipoFrontBuilder equipoFront = EquipoFront.builder();

        equipoFront.id( entity.getId() );
        equipoFront.nombre( entity.getNombre() );
        equipoFront.tipo( entity.getTipo() );

        return equipoFront.build();
    }

    @Override
    public List<EquipoFront> toFrontList(List<Equipo> list) {
        if ( list == null ) {
            return null;
        }

        List<EquipoFront> list1 = new ArrayList<EquipoFront>( list.size() );
        for ( Equipo equipo : list ) {
            list1.add( toFront( equipo ) );
        }

        return list1;
    }

    @Override
    public List<EquipoBack> toBackList(List<Equipo> list) {
        if ( list == null ) {
            return null;
        }

        List<EquipoBack> list1 = new ArrayList<EquipoBack>( list.size() );
        for ( Equipo equipo : list ) {
            list1.add( toBack( equipo ) );
        }

        return list1;
    }

    @Override
    public List<Equipo> toEntityList(List<EquipoBack> list) {
        if ( list == null ) {
            return null;
        }

        List<Equipo> list1 = new ArrayList<Equipo>( list.size() );
        for ( EquipoBack equipoBack : list ) {
            list1.add( toEntity( equipoBack ) );
        }

        return list1;
    }
}
