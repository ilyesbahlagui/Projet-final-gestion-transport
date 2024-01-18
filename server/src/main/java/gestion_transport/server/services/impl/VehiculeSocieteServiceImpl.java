package gestion_transport.server.services.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import gestion_transport.server.dto.VehiculeSocieteDTO;
import gestion_transport.server.entities.Categorie;
import gestion_transport.server.entities.ReservationProfessionnelle;
import gestion_transport.server.entities.VehiculeSociete;
import gestion_transport.server.enums.StatutAnnonceEnum;
import gestion_transport.server.enums.StatutVehiculeEnum;
import gestion_transport.server.repositories.CategorieRepository;
import gestion_transport.server.repositories.ReservationProfessionnelleRepository;
import gestion_transport.server.repositories.VehiculeSocieteRepository;
import gestion_transport.server.services.MailService;
import gestion_transport.server.services.VehiculeSocieteService;
import lombok.AllArgsConstructor;

@Service
@Transactional // This ensures everything gets persisted to the DB.
@EnableScheduling
@AllArgsConstructor
public class VehiculeSocieteServiceImpl implements VehiculeSocieteService {
    private VehiculeSocieteRepository vehiculeSocieteRepository;
    private CategorieRepository categorieRepository;
    private ReservationProfessionnelleRepository reservationProfessionnelleRepository;
    private MailService mailService;

    @Override
    public VehiculeSociete addVehiculeSociete(VehiculeSocieteDTO vehiculeSocieteDTO) {
        Categorie categorie = categorieRepository.findById(vehiculeSocieteDTO.getCategorieID()).get();
        VehiculeSociete vehiculeSociete = vehiculeSocieteDTO.toEntity(categorie);
        vehiculeSocieteRepository.save(vehiculeSociete);
        return vehiculeSociete;
    }

    @Override
    public void deleteVehiculeSociete(int id) {
        VehiculeSociete vehiculeSociete = vehiculeSocieteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Le véhicule n'existe pas."));
        vehiculeSocieteRepository.delete(vehiculeSociete);
    }

    @Override
    public VehiculeSociete readVehiculeSociete(int id) {
        return vehiculeSocieteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Le véhicule n'existe pas."));
    }

    @Override
    public VehiculeSociete updateVehiculeSociete(VehiculeSocieteDTO vehiculeSocieteDTO) {
        Categorie categorie = categorieRepository.findById(vehiculeSocieteDTO.getCategorieID()).get();
        VehiculeSociete vehiculeSociete = vehiculeSocieteRepository.findById(vehiculeSocieteDTO.getId())
                .orElseThrow(() -> new RuntimeException("Le véhicule n'existe pas."));
        if(vehiculeSociete.getStatut() == StatutVehiculeEnum.EN_SERVICE &&
                (StatutVehiculeEnum.EN_REPARATION.name().equals(vehiculeSocieteDTO.getStatut()) || 
                        StatutVehiculeEnum.HORS_SERVICE.name().equals(vehiculeSocieteDTO.getStatut()))) {
                            cancelReservationInProgress(vehiculeSociete.getId());
        }
        vehiculeSociete = vehiculeSocieteDTO.toEntity(categorie);
        vehiculeSocieteRepository.save(vehiculeSociete);
        return vehiculeSociete;
    }

    @Override
    public Stream<VehiculeSociete> listVehiculeSocietes() {
        return vehiculeSocieteRepository.findAll().stream();
    }

    public void cancelReservationInProgress(int vehiculeId) {
        VehiculeSociete vehicule = vehiculeSocieteRepository.findById(vehiculeId).orElseThrow();
        List<ReservationProfessionnelle> reservationsEnCours = reservationProfessionnelleRepository.getReservationInProgress(vehiculeId);
        Set<String> emails = new HashSet<>();

        for (ReservationProfessionnelle reservation : reservationsEnCours) {
            reservation.setStatut(StatutAnnonceEnum.ANNULE);
            reservationProfessionnelleRepository.save(reservation);

            emails.add(reservation.getEmploye().getEmail());
        }

        String message = "Bonjour, le véhicule (%s) que vous avez reservé n'est plus disponible, votre réservation a donc été annulée".formatted(vehicule.getImmatriculation());
        mailService.sendMail("Annulation Réservation", message, emails.toArray(String[]::new));
    }
}
