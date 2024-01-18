
import logo from '../assets/img/logo.png'; 

interface LogoProps {
  maxWidth?: string;
  maxHeight?: string;
}

export const Logo = ({ maxWidth = '200px', maxHeight = '100px' }: LogoProps) => {
    const imgStyle = {
        maxWidth: maxWidth,
        maxHeight: maxHeight,
        display: 'block', // Permet de centrer l'image
        marginLeft: 'auto',
        marginRight: 'auto',
      };
  // Import result is the URL of your image
  return <img src={logo} style={imgStyle} alt="Logo" />;
}