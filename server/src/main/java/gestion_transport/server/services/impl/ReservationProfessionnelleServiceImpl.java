package gestion_transport.server.services.impl;

import java.util.Optional;
import java.util.stream.Stream;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import gestion_transport.server.dto.ReservationProfessionnelleDTO;
import gestion_transport.server.entities.Employe;
import gestion_transport.server.entities.ReservationProfessionnelle;
import gestion_transport.server.entities.VehiculeSociete;
import gestion_transport.server.enums.StatutVehiculeEnum;
import gestion_transport.server.repositories.EmployeRepository;
import gestion_transport.server.repositories.ReservationProfessionnelleRepository;
import gestion_transport.server.repositories.VehiculeSocieteRepository;
import gestion_transport.server.services.ReservationProfessionnelleService;
import lombok.AllArgsConstructor;

@Service
@Transactional // This ensures everything gets persisted to the DB.
@EnableScheduling
@AllArgsConstructor
public class ReservationProfessionnelleServiceImpl implements ReservationProfessionnelleService {
        private VehiculeSocieteRepository vehiculeSocieteRepository;
        private ReservationProfessionnelleRepository reservationProfessionnelleRepository;
        private EmployeRepository employeRepository;

        @Override
        public ReservationProfessionnelle addReservation(Employe employe, ReservationProfessionnelleDTO reservationProfessionnelleDTO) {
                VehiculeSociete vehicule = vehiculeSocieteRepository.findById(reservationProfessionnelleDTO.getVehiculeID()).orElseThrow();
                Optional<Employe> chauffeurOpt = Optional.ofNullable(reservationProfessionnelleDTO.getConducteurID()).flatMap(id -> employeRepository.findById(id.orElse(null)));
                Employe chauffeur = chauffeurOpt.isPresent() ? chauffeurOpt.get() : null;

                if (vehicule.getStatut() != StatutVehiculeEnum.EN_SERVICE) {
                        throw new RuntimeException("Il est impossible de reserver un véhicule qui n'est pas en service.");
                }

                ReservationProfessionnelle reservation = reservationProfessionnelleDTO.toEntity(employe, vehicule, chauffeur);

                employe.getReservations().add(reservation);
                reservationProfessionnelleRepository.save(reservation);
                employeRepository.save(employe);
                return reservation;
        }

        @Override
        public void deleteReservation(Employe employe, int id) {
                ReservationProfessionnelle reservation = (ReservationProfessionnelle) employe.getReservations().stream()
                                .filter(r -> r.getId() == id).findFirst()
                                .orElseThrow(() -> new RuntimeException("La réservation n'existe pas."));
                reservationProfessionnelleRepository.delete(reservation);
                employe.getReservations().remove(reservation);
                employeRepository.save(employe);
        }

        @Override
        public ReservationProfessionnelle readReservation(Employe employe, int id) {
                return (ReservationProfessionnelle) employe.getReservations().stream().filter(r -> r.getId() == id)
                                .findFirst()
                                .orElseThrow(() -> new RuntimeException("La réservation n'existe pas."));
        }

        @Override
        public ReservationProfessionnelle updateReservation(Employe employe,
                        ReservationProfessionnelleDTO reservationProfessionnelleDTO) {
                ReservationProfessionnelle reservation = (ReservationProfessionnelle) employe.getReservations().stream()
                                .filter(r -> r.getId() == reservationProfessionnelleDTO.getId()).findFirst()
                                .orElseThrow(() -> new RuntimeException("La réservation n'existe pas."));

                VehiculeSociete vehicule = vehiculeSocieteRepository
                                .findById(reservationProfessionnelleDTO.getVehiculeID()).orElseThrow();
                if (vehicule.getStatut() != StatutVehiculeEnum.EN_SERVICE) {
                        throw new RuntimeException("Il est impossible de reserver un véhicule qui n'est pas en service.");
                }

                Optional<Employe> chauffeur = reservationProfessionnelleDTO.getConducteurID().flatMap(id -> employeRepository.findById(id));

                reservation = reservationProfessionnelleDTO.toEntity(employe,
                                vehicule, chauffeur.orElseThrow());

                reservationProfessionnelleRepository.save(reservation);
                return reservation;
        }

        @Override
        public Stream<ReservationProfessionnelle> listReservationsVehicule(int vehiculeSocieteId) {
                VehiculeSociete vehiculeSociete = vehiculeSocieteRepository.findById(vehiculeSocieteId)
                                .orElseThrow(() -> new RuntimeException("La réservation n'existe pas."));
                return reservationProfessionnelleRepository.findReservationVehicule(vehiculeSociete).stream();
        }

        @Override
        public Stream<ReservationProfessionnelle> listReservations(Employe employe) {
                return reservationProfessionnelleRepository.findByEmploye(employe).stream();
        }

}
