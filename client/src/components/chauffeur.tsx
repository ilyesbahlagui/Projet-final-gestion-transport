import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { Chauffeur } from '../models/chauffeur';

const generateAvatarUrl = () => {
    const gender = Math.random() < 0.5 ? 'male' : 'female';
    return `https://xsgames.co/randomusers/avatar.php?g=${gender}`;
};

const ChauffeurElement = (props: { chauffeur: Chauffeur }) => {
    return (
        <Container style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px', flexBasis: '30%', minHeight: '300px', boxShadow: '0px 0px 5px 3px #d6d6d6'}}>
            <Row style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', textAlign: 'left' }}>
                <h4>{props.chauffeur.lastName.toUpperCase()} {props.chauffeur.firstName.charAt(0).toUpperCase() + props.chauffeur.firstName.slice(1)}</h4>
            </Row>
            <Row style={{ marginTop: '30px'}}>
                <Col xs={12} lg={4}>
                    <img src={generateAvatarUrl()} alt="Driver" style={{ width: '150px', height: '150px'}} />
                </Col>
                <Col xs={6} lg={3} style={{ textAlign: 'left' }}>
                    <Row>
                        <Col xs={12}><strong>Nom</strong></Col>
                        <Col xs={12}><strong>Prénom</strong></Col>
                        <Col xs={12}><strong>Permis</strong></Col>
                        <Col xs={12}><strong>Email</strong></Col>
                        <Col xs={12}><strong>Téléphone</strong></Col>
                    </Row>
                </Col>
                <Col xs={6} lg={5} style={{ textAlign: 'left' }}>
                    <Row>
                        <Col xs={12}>{props.chauffeur.lastName.toUpperCase()}</Col>
                        <Col xs={12}>{props.chauffeur.firstName.charAt(0).toUpperCase() + props.chauffeur.firstName.slice(1)}</Col>
                        <Col xs={12}>{props.chauffeur.permis}</Col>
                        <Col xs={12}>{props.chauffeur.email}</Col>
                        <Col xs={12}>{props.chauffeur.phone}</Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default ChauffeurElement;