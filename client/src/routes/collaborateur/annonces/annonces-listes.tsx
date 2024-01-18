import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppContext } from "../../../App";
import { Annonce, StatutAnnonce } from "../../../models/annonce";
import { Button } from "react-bootstrap";
import ModalComponent from "../../../components/modal";
import { PaginatedTable, PaginatedTableProps } from "../../../components/paginated-table";
import { paginate } from "../../../lib/utils";
import { formatDate } from "../../../lib/date";

export const AnnoncesListes = () => {
  const [selectedAnnonce, setSelectedAnnonce] = useState<Annonce | null>(null);
  const [, setUserAnnonces] = useState<Annonce[]>([]);
  const [annoncesEnCours, setAnnoncesEnCours] = useState<Annonce[]>([]);
  const [annoncesHistorique, setAnnoncesHistorique] = useState<Annonce[]>([]);

  const openModal = (annonce: Annonce) => {
    setSelectedAnnonce(annonce);
  };
  const closeModal = () => {
    setSelectedAnnonce(null);
  };

  const saveChanges = async () => {
    if (selectedAnnonce !== null) {
        await AppContext.services.annonce.cancel(selectedAnnonce)
            .then(() => {
                getAnnoncesUser();
                alert(
                    "L'annonce et les réservations associées ont été annulées avec succès."
                );
            })
            .catch(error => {
                console.error(error);
            });
        closeModal();
    }
  };
  const getAnnoncesUser = () => {
    AppContext.services.annonce.getAll().then(async response => {
      if (response.data) {
        const employeID = AppContext.services.authentication.employe?.id;

        if (employeID) {
          const allAnnonces = response.data;
          const userAnnoncesFiltered = allAnnonces.filter(
            annonce => annonce.employeID === employeID
          );

          setUserAnnonces(userAnnoncesFiltered);

          const today = new Date();
          const annoncesEnCoursFiltered: Annonce[] =
            userAnnoncesFiltered.filter(
              annonce =>
                new Date(annonce.date) > today &&
                annonce.statut !== StatutAnnonce.Annulé
            );
          const annoncesHistoriqueFiltered: Annonce[] =
            userAnnoncesFiltered.filter(
              annonce =>
                new Date(annonce.date) <= today ||
                annonce.statut === StatutAnnonce.Terminé
            );

          setAnnoncesEnCours(() => annoncesEnCoursFiltered);
          setAnnoncesHistorique(() => annoncesHistoriqueFiltered);
        }
      }
    });
  };

  useEffect(getAnnoncesUser, []);

  const makeTable = (annonces: Annonce[], isHistory = false) =>
  {
      const itemsPerPage = 5;
      const props: PaginatedTableProps<Annonce> =
      {
        header:
          <tr>
            <td>Date / Heure de départ</td>
            <td>Lieu de départ</td>
            <td>Lieu de destination</td>
            <td>Places disponibles</td>
            {!isHistory && <td>Action</td>}
          </tr>,
        totalItems: annonces.length,
        itemsPerPage,
        getItems: page => paginate(annonces, page, itemsPerPage),
        renderItem: (item: Annonce, index: number) =>
          <tr key={item.id}>
            <td>{formatDate(item.date)}</td>
            <td>{item.adresseDepart}</td>
            <td>{item.adresseDestination}</td>
            <td>{item.placeDisponible}</td>
            {!isHistory &&
              <td>
                <Button variant="danger" onClick={() => openModal(item)}>
                    Annuler
                </Button>
              </td>}
          </tr>,
          hidePagination: !isHistory,
      };

      return (<PaginatedTable {...props} />);
  };

  return (
    <div className="col-11 d-flex flex-column m-auto ">
      {/* Titre */}
      <h1 className="text-lg-start text-center">Vos Annonces</h1>
      <div className="col-12 d-flex justify-content-end">
        <Link to="/collaborateur/annonces/creer" className="btn btn-primary">
          Créer une nouvelle annonce
        </Link>
      </div>

      {/* Annonces en cours */}
      <div className="mt-5">
        <h3 className="text-lg-start text-center"> Annonces en cours</h3>
        {makeTable(annoncesEnCours)}
      </div>
      {/* Historique */}
      <div className="mt-5">
        <h3 className="text-lg-start text-center"> Historique</h3>
        {makeTable(annoncesHistorique, true)}
      </div>
      {selectedAnnonce !== null && (
        <ModalComponent
          show={true}
          handleClose={closeModal}
          onSave={saveChanges}
          title={"Confirmation"}
          body={"Etes-vous sûr de vouloir annuler cette annonce ?"}
          closeButtonLabel={"Annuler"}
          saveButtonLabel={"Confirmer"}
        />
      )}
    </div>
  );
};
