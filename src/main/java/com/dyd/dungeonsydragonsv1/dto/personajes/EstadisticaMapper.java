package com.dyd.dungeonsydragonsv1.dto.personajes;

import com.dyd.dungeonsydragonsv1.entidades.Estadistica;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EstadisticaMapper {
    Estadistica toEntity(EstadisticaFront dto);
    EstadisticaFront toFront(Estadistica entity);
    List<EstadisticaFront> toFrontList(List<Estadistica> list);
    List<Estadistica> toEntityList(List<EstadisticaFront> list);
}
