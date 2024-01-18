import React from 'react';
import Button from 'react-bootstrap/Button';

interface ButtonComponentProps {
  onClick: () => void;
  buttonText: string;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ onClick, buttonText }) => {
  return (
    <Button variant="danger" onClick={onClick}>
      {buttonText} 
    </Button>
  );
}

export default ButtonComponent;