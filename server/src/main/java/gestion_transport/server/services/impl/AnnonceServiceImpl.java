package gestion_transport.server.services.impl;

import lombok.AllArgsConstructor;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Stream;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import gestion_transport.server.dto.AnnonceDTO;
import gestion_transport.server.entities.Annonce;
import gestion_transport.server.entities.Employe;
import gestion_transport.server.entities.ReservationCovoiturage;
import gestion_transport.server.enums.StatutAnnonceEnum;
import gestion_transport.server.repositories.*;
import gestion_transport.server.services.AnnonceService;
import gestion_transport.server.services.MailService;

@Service
@Transactional // This ensures everything gets persisted to the DB.
@EnableScheduling
@AllArgsConstructor
public class AnnonceServiceImpl implements AnnonceService {
    private AnnonceRepository annonceRepository;
    private EmployeRepository employeRepository;
    private ReservationCovoiturageRepository reservationCovoiturageRepository;
    private MailService mailService;

    @Override
    public Annonce addAnnonce(Employe employe, AnnonceDTO annonceDTO) {
        Annonce annonce = annonceDTO.toEntity(employe);
        employe.getAnnonces().add(annonce);
        annonceRepository.save(annonce);
        employeRepository.save(employe);
        return annonce;
    }

    @Override
    public void deleteAnnonce(Employe employe, int id) {
        Annonce annonce = employe.getAnnonces().stream().filter(a -> a.getId() == id).findFirst()
                .orElseThrow(() -> new RuntimeException("L'annonce n'existe pas."));
        annonceRepository.delete(annonce);
        employe.getAnnonces().remove(annonce);
        employeRepository.save(employe);
    }

    @Override
    public Annonce readAnnonce(Employe employe, int id) {
        return employe.getAnnonces().stream().filter(a -> a.getId() == id).findFirst()
                .orElseThrow(() -> new RuntimeException("L'annonce n'existe pas."));
    }

    @Override
    public Annonce updateAnnonce(Employe employe, AnnonceDTO annonceDTO) {
        Annonce annonce = employe.getAnnonces().stream().filter(a -> a.getId() == annonceDTO.getId()).findFirst()
                .orElseThrow(() -> new RuntimeException("L'annonce n'existe pas."));
        annonce = annonceDTO.toEntity(employe);
        annonceRepository.save(annonce);
        return annonce;
    }

    @Override
    public Stream<Annonce> listAnnonces() {
        return annonceRepository.findAll().stream();
    }

    @Override
    public Stream<Annonce> listAnnonces(Employe employe) {
        // return employe.getAnnonces().stream();
        return annonceRepository.findByEmploye(employe).stream();

    }

    @Override
    public Annonce cancel(Employe employe, int id)
    {
        Annonce annonce = readAnnonce(employe, id);
        annonce.setStatut(StatutAnnonceEnum.ANNULE);
        annonceRepository.save(annonce);

        Set<Employe> employes = new HashSet<>();
        employes.add(annonce.getEmploye());
        for (ReservationCovoiturage reservation : annonce.getReservations()) {
            reservation.setStatut(StatutAnnonceEnum.ANNULE);
            reservationCovoiturageRepository.save(reservation);
            employes.add(reservation.getEmploye());
        }

        String[] emails = employes.stream().map(e -> e.getEmail()).toArray(String[]::new);
        mailService.sendMail("Annulation d'une annonce", "L'annonce %s a été annulée.".formatted(annonce.getImmatriculation()), emails);

        return annonce;
    }

}
