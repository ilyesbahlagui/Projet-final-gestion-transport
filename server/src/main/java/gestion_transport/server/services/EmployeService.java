package gestion_transport.server.services;

import java.util.stream.Stream;

import gestion_transport.server.entities.Employe;

public interface EmployeService {
    
    public Employe updateEmploye(Employe employe);

    Employe readEmploye(int id);

    Employe readEmployeMatricule(String matricule);

    public Stream<Employe> listChauffeurs();
}
