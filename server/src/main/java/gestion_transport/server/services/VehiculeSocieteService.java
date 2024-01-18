package gestion_transport.server.services;

import java.util.stream.Stream;

import gestion_transport.server.dto.VehiculeSocieteDTO;
import gestion_transport.server.entities.VehiculeSociete;

public interface VehiculeSocieteService {

    public VehiculeSociete addVehiculeSociete(VehiculeSocieteDTO vehiculeSocieteDTO);

    public void deleteVehiculeSociete(int id);

    VehiculeSociete readVehiculeSociete(int id);

    public VehiculeSociete updateVehiculeSociete(VehiculeSocieteDTO vehiculeSocieteDTO);

    public Stream<VehiculeSociete> listVehiculeSocietes();
}
