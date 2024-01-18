package gestion_transport.server.services.impl;

import java.util.stream.Stream;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import gestion_transport.server.dto.ReservationCovoiturageDTO;
import gestion_transport.server.entities.Annonce;
import gestion_transport.server.entities.Employe;
import gestion_transport.server.entities.ReservationCovoiturage;
import gestion_transport.server.enums.StatutAnnonceEnum;
import gestion_transport.server.repositories.AnnonceRepository;
import gestion_transport.server.repositories.EmployeRepository;
import gestion_transport.server.repositories.ReservationCovoiturageRepository;
import gestion_transport.server.services.MailService;
import gestion_transport.server.services.ReservationCovoiturageService;
import lombok.AllArgsConstructor;

@Service
@Transactional // This ensures everything gets persisted to the DB.
@EnableScheduling
@AllArgsConstructor
public class ReservationCovoiturageServiceImpl implements ReservationCovoiturageService {
    private AnnonceRepository annonceRepository;
    private ReservationCovoiturageRepository reservationCovoiturageRepository;
    private EmployeRepository employeRepository;
    private MailService mailService;

    @Override
    public ReservationCovoiturage addReservation(Employe employe, ReservationCovoiturageDTO reservationCovoiturageDTO) {
        if (employe
            .getReservations()
            .stream()
            .filter(r -> r.getClass().equals(ReservationCovoiturage.class))
            .anyMatch(reservation -> ((ReservationCovoiturage)reservation).getAnnonce().getId() == reservationCovoiturageDTO.getAnnonceID()))
        {
            throw new RuntimeException("Déjà réservé.");
        }

        Annonce annonce = annonceRepository
            .findById(reservationCovoiturageDTO.getAnnonceID())
            .orElseThrow();

        if (annonce.getPlaceDisponible() < 1)
            throw new RuntimeException("Plus de place disponible pour ce covoiturage.");

        ReservationCovoiturage reservation = reservationCovoiturageDTO.toEntity(employe, annonce);
        reservation.setStatut(StatutAnnonceEnum.CONFIRME);
        reservationCovoiturageRepository.save(reservation);

        annonce.setPlaceDisponible(annonce.getPlaceDisponible() - 1);
        annonceRepository.save(annonce);

        employe.getReservations().add(reservation);
        employeRepository.save(employe);

        return reservation;
    }

    @Override
    public ReservationCovoiturage readReservation(Employe employe, int id)
    {
        return (ReservationCovoiturage)employe.getReservations().stream()
            .filter(r -> r.getId() == id)
            .findFirst()
            .orElseThrow(() -> new RuntimeException("La réservation n'existe pas."));
    }

    @Override
    public void deleteReservation(Employe employe, int id) {
        ReservationCovoiturage reservation = readReservation(employe, id);

        if (reservation.getStatut() == StatutAnnonceEnum.CONFIRME) {
            Annonce annonce = reservation.getAnnonce();
            annonce.setPlaceDisponible(annonce.getPlaceDisponible() + 1);
            annonceRepository.save(annonce);
        }

        reservationCovoiturageRepository.delete(reservation);
        employe.getReservations().remove(reservation);
        employeRepository.save(employe);
    }

    @Override
    public Stream<ReservationCovoiturage> listReservation(Employe employe) {
        return reservationCovoiturageRepository.findByEmploye(employe).stream();
    }

    @Override
    public ReservationCovoiturage cancel(Employe employe, int id)
    {
        var reservation = readReservation(employe, id);
        reservation.setStatut(StatutAnnonceEnum.ANNULE);
        reservationCovoiturageRepository.save(reservation);

        var annonce = reservation.getAnnonce();
        annonce.setPlaceDisponible(annonce.getPlaceDisponible() + 1);
        annonceRepository.save(annonce);

        var emails = Stream.of(reservation.getEmploye(), annonce.getEmploye()).map(e -> e.getEmail()).toArray(String[]::new);
        mailService.sendMail("Annulation d'une réservation", "La réservation %s a été annulée.".formatted(reservation.getAnnonce().getImmatriculation()), emails);

        return reservation;
    }
}
