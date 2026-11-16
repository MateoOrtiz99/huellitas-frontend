import { useState, useEffect } from 'react';

function MascotasSection() {
  const [mascotas, setMascotas] = useState([]);
  const [refugios, setRefugios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  return (
    <div>
      <h2>Gestión de mascotas</h2>
      <p>Aquí se mostrarán las mascotas registradas.</p>
    </div>
  );
}

export default MascotasSection;