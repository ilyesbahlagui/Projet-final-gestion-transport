package gestion_transport.server.services;

import java.util.stream.Stream;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import gestion_transport.server.entities.Employe;
import gestion_transport.server.entities.ReservationProfessionnelle;
import gestion_transport.server.repositories.EmployeRepository;
import gestion_transport.server.repositories.ReservationProfessionnelleRepository;
import lombok.AllArgsConstructor;

@Service
@Transactional // This ensures everything gets persisted to the DB.
@EnableScheduling
@AllArgsConstructor
public class ChauffeurReservationService
{
        private ReservationProfessionnelleRepository reservationProfessionnelleRepository;
        private EmployeRepository employeRepository;

        public Stream<ReservationProfessionnelle> listAssigned(Employe chauffeur)
        {
                return chauffeur.getReservationsChauffeur().stream();
        }

        public Stream<ReservationProfessionnelle> listUnassigned()
        {
                return this.reservationProfessionnelleRepository.listUnassigned().stream();
        }

        public ReservationProfessionnelle accept(Employe chauffeur, int reservationID)
        {
                ReservationProfessionnelle reservation = reservationProfessionnelleRepository.findById(reservationID).orElseThrow();

                reservation.setConducteur(chauffeur);
                reservationProfessionnelleRepository.save(reservation);

                // NOTE: Manually update the instance as we're using eager fetching, otherwise we'll be stuck with the frozen set until a reconnect.
                chauffeur.getReservationsChauffeur().add(reservation);
                employeRepository.save(chauffeur);

                return reservation;
        }
}
