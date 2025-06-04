package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Clase;
import com.dyd.dungeonsydragonsv1.entidades.Estadistica;
import com.dyd.dungeonsydragonsv1.entidades.Personaje;
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
public class PersonajeMapperImpl implements PersonajeMapper {

    @Override
    public PersonajeFront toFront(Personaje entity) {
        if ( entity == null ) {
            return null;
        }

        PersonajeFront.PersonajeFrontBuilder personajeFront = PersonajeFront.builder();

        personajeFront.raza( entityRazaNombre( entity ) );
        personajeFront.clase( entityClaseNombre( entity ) );
        personajeFront.id( entity.getId() );
        personajeFront.nombre( entity.getNombre() );
        personajeFront.equipo( mapEquipo( entity.getEquipo() ) );
        personajeFront.hechizos( mapHechizos( entity.getHechizos() ) );
        personajeFront.estadistica( entity.getEstadistica() );

        return personajeFront.build();
    }

    @Override
    public List<PersonajeFront> toFrontList(List<Personaje> list) {
        if ( list == null ) {
            return null;
        }

        List<PersonajeFront> list1 = new ArrayList<PersonajeFront>( list.size() );
        for ( Personaje personaje : list ) {
            list1.add( toFront( personaje ) );
        }

        return list1;
    }

    @Override
    public PersonajeGaleriaDto toGaleria(Personaje entity) {
        if ( entity == null ) {
            return null;
        }

        PersonajeGaleriaDto.PersonajeGaleriaDtoBuilder personajeGaleriaDto = PersonajeGaleriaDto.builder();

        personajeGaleriaDto.raza( entityRazaNombre( entity ) );
        personajeGaleriaDto.clase( entityClaseNombre( entity ) );
        personajeGaleriaDto.fuerza( entityEstadisticaFuerza( entity ) );
        personajeGaleriaDto.destreza( entityEstadisticaDestreza( entity ) );
        personajeGaleriaDto.resistencia( entityEstadisticaResistencia( entity ) );
        personajeGaleriaDto.magia( entityEstadisticaMagia( entity ) );
        personajeGaleriaDto.hechizos( mapHechizos( entity.getHechizos() ) );
        personajeGaleriaDto.equipo( mapEquipo( entity.getEquipo() ) );
        personajeGaleriaDto.id( entity.getId() );
        personajeGaleriaDto.nombre( entity.getNombre() );

        return personajeGaleriaDto.build();
    }

    @Override
    public List<PersonajeGaleriaDto> toGaleriaList(List<Personaje> list) {
        if ( list == null ) {
            return null;
        }

        List<PersonajeGaleriaDto> list1 = new ArrayList<PersonajeGaleriaDto>( list.size() );
        for ( Personaje personaje : list ) {
            list1.add( toGaleria( personaje ) );
        }

        return list1;
    }

    @Override
    public PersonajeBack toBack(Personaje entity) {
        if ( entity == null ) {
            return null;
        }

        PersonajeBack.PersonajeBackBuilder personajeBack = PersonajeBack.builder();

        personajeBack.id( entity.getId() );
        personajeBack.nombre( entity.getNombre() );

        return personajeBack.build();
    }

    @Override
    public List<PersonajeBack> toBackList(List<Personaje> list) {
        if ( list == null ) {
            return null;
        }

        List<PersonajeBack> list1 = new ArrayList<PersonajeBack>( list.size() );
        for ( Personaje personaje : list ) {
            list1.add( toBack( personaje ) );
        }

        return list1;
    }

    @Override
    public Personaje toEntity(PersonajeBack dto) {
        if ( dto == null ) {
            return null;
        }

        Personaje.PersonajeBuilder personaje = Personaje.builder();

        personaje.id( dto.getId() );
        personaje.nombre( dto.getNombre() );

        return personaje.build();
    }

    private String entityRazaNombre(Personaje personaje) {
        Raza raza = personaje.getRaza();
        if ( raza == null ) {
            return null;
        }
        return raza.getNombre();
    }

    private String entityClaseNombre(Personaje personaje) {
        Clase clase = personaje.getClase();
        if ( clase == null ) {
            return null;
        }
        return clase.getNombre();
    }

    private int entityEstadisticaFuerza(Personaje personaje) {
        Estadistica estadistica = personaje.getEstadistica();
        if ( estadistica == null ) {
            return 0;
        }
        return estadistica.getFuerza();
    }

    private int entityEstadisticaDestreza(Personaje personaje) {
        Estadistica estadistica = personaje.getEstadistica();
        if ( estadistica == null ) {
            return 0;
        }
        return estadistica.getDestreza();
    }

    private int entityEstadisticaResistencia(Personaje personaje) {
        Estadistica estadistica = personaje.getEstadistica();
        if ( estadistica == null ) {
            return 0;
        }
        return estadistica.getResistencia();
    }

    private int entityEstadisticaMagia(Personaje personaje) {
        Estadistica estadistica = personaje.getEstadistica();
        if ( estadistica == null ) {
            return 0;
        }
        return estadistica.getMagia();
    }
}
