package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Estadistica;
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
public class EstadisticaMapperImpl implements EstadisticaMapper {

    @Override
    public Estadistica toEntity(EstadisticaFront dto) {
        if ( dto == null ) {
            return null;
        }

        Estadistica.EstadisticaBuilder estadistica = Estadistica.builder();

        estadistica.fuerza( dto.getFuerza() );
        estadistica.destreza( dto.getDestreza() );
        estadistica.resistencia( dto.getResistencia() );
        estadistica.magia( dto.getMagia() );

        return estadistica.build();
    }

    @Override
    public EstadisticaFront toFront(Estadistica entity) {
        if ( entity == null ) {
            return null;
        }

        EstadisticaFront.EstadisticaFrontBuilder estadisticaFront = EstadisticaFront.builder();

        estadisticaFront.fuerza( entity.getFuerza() );
        estadisticaFront.destreza( entity.getDestreza() );
        estadisticaFront.resistencia( entity.getResistencia() );
        estadisticaFront.magia( entity.getMagia() );

        return estadisticaFront.build();
    }

    @Override
    public List<EstadisticaFront> toFrontList(List<Estadistica> list) {
        if ( list == null ) {
            return null;
        }

        List<EstadisticaFront> list1 = new ArrayList<EstadisticaFront>( list.size() );
        for ( Estadistica estadistica : list ) {
            list1.add( toFront( estadistica ) );
        }

        return list1;
    }

    @Override
    public List<Estadistica> toEntityList(List<EstadisticaFront> list) {
        if ( list == null ) {
            return null;
        }

        List<Estadistica> list1 = new ArrayList<Estadistica>( list.size() );
        for ( EstadisticaFront estadisticaFront : list ) {
            list1.add( toEntity( estadisticaFront ) );
        }

        return list1;
    }
}
