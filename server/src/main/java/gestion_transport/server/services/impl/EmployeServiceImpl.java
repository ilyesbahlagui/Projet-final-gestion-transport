package gestion_transport.server.services.impl;

import java.util.stream.Stream;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import gestion_transport.server.entities.Employe;
import gestion_transport.server.repositories.EmployeRepository;
import gestion_transport.server.services.EmployeService;
import lombok.AllArgsConstructor;

@Service
@Transactional // This ensures everything gets persisted to the DB.
@EnableScheduling
@AllArgsConstructor
public class EmployeServiceImpl implements EmployeService {
    private EmployeRepository employeRepository;

    @Override
    public Employe updateEmploye(Employe employe) {
        employeRepository.save(employe);
        return employe;
    }

    @Override
    public Employe readEmploye(int id) {
        return employeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("L'employé n'existe pas."));
    }

    @Override
    public Employe readEmployeMatricule(String matricule) {
        return employeRepository.findByMatricule(matricule)
                .orElseThrow(() -> new RuntimeException("L'employé n'existe pas."));
    }

    @Override
    public Stream<Employe> listChauffeurs() {
        return employeRepository.getAllChauffeurs().stream();
    }
}
