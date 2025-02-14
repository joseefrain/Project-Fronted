import { Link } from 'react-router-dom';
import Image404 from '../../../../assets/404-2.png';
import './styles.scss';
import { Typography } from '../Typography';

export const NotFound404 = () => {
  return (
    <div className="not-found-404">
      <img src={Image404} alt="" />

      <Typography component="h1">Oooops! Sentimos el error 😵</Typography>

      <Typography className="message" component="h4">
        <>
          El sitio al que intentas acceder al parecer no existe. Haz click en el
          siguiente botón para <Link to="/">volver al inicio</Link>.
        </>
      </Typography>
    </div>
  );
};
