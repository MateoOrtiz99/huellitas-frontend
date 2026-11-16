
import { useState } from 'react';
import './MascotasSection.css';

function MascotasSection() {
  const [mascotas, setMascotas] = useState([]);
  const [refugios, setRefugios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [estado, setEstado] = useState('');
  const [refugio, setRefugio] = useState('');

  function agregarMascota(e) {
    e.preventDefault();

    if (!nombre || !especie || !estado || !refugio) {
      setError('Completa todos los campos.');
      return;
    }

    setError('Todavía falta conectar el formulario con el backend.');
  }

  return (
    <section>
      <h2>Gestión de mascotas 🐾</h2>

      <form onSubmit={agregarMascota}>
        <input
          type="text"
          placeholder="Nombre de la mascota"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="text"
          placeholder="Especie"
          value={especie}
          onChange={(e) => setEspecie(e.target.value)}
        />

        <input
          type="text"
          placeholder="Estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        />

        <select
          value={refugio}
          onChange={(e) => setRefugio(e.target.value)}
        >
          <option value="">Selecciona un refugio</option>
          {refugios.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre}
            </option>
          ))}
        </select>

        <button type="submit">Registrar mascota</button>
      </form>

      {error && <p>{error}</p>}

      <h3>Mascotas registradas</h3>

      {mascotas.length === 0 ? (
        <p>No hay mascotas registradas todavía.</p>
      ) : (
        mascotas.map((mascota) => (
          <p key={mascota.id}>{mascota.nombre}</p>
        ))
      )}
    </section>
  );
}

export default MascotasSection;
