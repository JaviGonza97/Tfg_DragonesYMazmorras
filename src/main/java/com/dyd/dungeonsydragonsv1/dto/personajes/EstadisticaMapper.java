package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Estadistica;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EstadisticaMapper {
    EstadisticaFront toFront(Estadistica entity);
}
