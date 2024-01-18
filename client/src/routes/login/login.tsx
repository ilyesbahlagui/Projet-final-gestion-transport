import { useState } from "react";
import { Container, Button, Form, Stack, Modal, Col, Row } from "react-bootstrap";
import { AppContext } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faTruck, faUser } from "@fortawesome/free-solid-svg-icons";
import { ProfilEmploye } from "../../models/employe";
import { Logo } from "../../components/logo";
import { Maybe } from "../../lib/types";

interface LoginProps {
	onProfileSelection: (selectedProfile: ProfilEmploye) => void;
}

export const Login = (props: LoginProps) =>
{
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [profil, setProfil] = useState<Maybe<ProfilEmploye>>();


	const login = () => AppContext.services.authentication
		.login({ email, password })
		.then(r => { 
			if (r.error) {
				setError("Vos informations d'authentification sont invalides.");
				return;
			}

			const profil = r.data?.profil;

			if (profil === ProfilEmploye.Collaborateur)
			{
				props.onProfileSelection(profil);
				return;
			}

			setShowModal(true);
			setProfil(profil);
		}
	);

	const handleProfileSelection = (selectedProfile: ProfilEmploye) => {
		setShowModal(false);
		props.onProfileSelection(selectedProfile);
	};

	return (
		<Container>
			<Stack gap={1}>
          		<Logo maxHeight="200px" maxWidth="200px"/>
				<h1>GDT</h1>
				<h2>Gestion Du Transport</h2>
			</Stack>

			<Form>
				<Stack gap={1}>
					<Form.Group>
						<Form.Label>Email</Form.Label>
						<Form.Control type="email" onChange={e => setEmail(e.target.value)} />
					</Form.Group>
					<Form.Group>
						<Form.Label>Mot de passe</Form.Label>
						<Form.Control type="password" onChange={e => setPassword(e.target.value)} />
					</Form.Group>
					<Form.Text className="text-danger">{error}</Form.Text>
					<Button onClick={login}>Se connecter</Button>
				</Stack>
			</Form>

			{/* Modal to select profile */}
			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Choisissez votre profil</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row className="justify-content-center">
						<Col xs={4} className="text-center">
							<div onClick={() => handleProfileSelection(ProfilEmploye.Collaborateur)}>
								<FontAwesomeIcon icon={faUser} size="3x" />
								<div>Collaborateur</div>
							</div>
						</Col>
						<Col xs={4} className="text-center">
							<div onClick={() => handleProfileSelection(ProfilEmploye.Chauffeur)}>
								<FontAwesomeIcon icon={faTruck} size="3x" />
								<div>Chauffeur</div>
							</div>
						</Col>
						{profil === ProfilEmploye.Administrateur && (
							<Col xs={4} className="text-center">
								<div onClick={() => handleProfileSelection(ProfilEmploye.Administrateur)}>
									<FontAwesomeIcon icon={faBuilding} size="3x" />
									<div>Administrateur</div>
								</div>
							</Col>
						)}
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						Fermer
					</Button>
				</Modal.Footer>
			</Modal>
		</Container>
	);
};
