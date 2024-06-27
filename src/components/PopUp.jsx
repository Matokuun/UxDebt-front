import React, { useEffect, useState } from 'react';
import '../styles/PopUp.css';

const Popup = ({ status, message, show, onClose }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 500); // Asegura que el PopUp desaparezca antes de llamar a onClose
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div className={`popup ${status} ${visible ? 'visible' : 'hidden'}`}>
      {message}
    </div>
  );
};

export default Popup;
