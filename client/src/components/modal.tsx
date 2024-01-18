import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ReactNode } from 'react';

interface ModalComponentProps {
  show: boolean;
  handleClose: () => void;
  onSave: () => void;
  title: string;
  body: ReactNode;
  closeButtonLabel?: string; 
  saveButtonLabel?: string; 
}

const ModalComponent: React.FC<ModalComponentProps> = ({ show, handleClose, onSave, title, body, closeButtonLabel, saveButtonLabel }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {closeButtonLabel} 
        </Button>
        <Button variant="primary" onClick={onSave}>
          {saveButtonLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalComponent;