
import { useState, useEffect } from 'react';
import './MascotasSection.css';

const API_URL = 'http://127.0.0.1:8000/api';

function MascotasSection() {
  const [mascotas, setMascotas] = useState([]);
  const [refugios, setRefugios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [estado, setEstado] = useState('');
  const [refugio, setRefugio] = useState('');

  // Cargar mascotas y refugios desde Django
  useEffect(() => {
    async function cargarDatos() {
      try {
        setCargando(true);
        setError('');

        const respuestaMascotas = await fetch(`${API_URL}/mascotas/`);
        const respuestaRefugios = await fetch(`${API_URL}/refugios/`);

        if (!respuestaMascotas.ok || !respuestaRefugios.ok) {
          throw new Error('No se pudieron cargar los datos.');
        }

        const datosMascotas = await respuestaMascotas.json();
        const datosRefugios = await respuestaRefugios.json();

        setMascotas(datosMascotas);
        setRefugios(datosRefugios);

      } catch (err) {
        setError('Error al conectar con el servidor.');
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  // Registrar una mascota
  async function agregarMascota(e) {
    e.preventDefault();
    setError('');

    if (!nombre || !especie || !estado || !refugio) {
      setError('Completa todos los campos.');
      return;
    }

    try {
      setCargando(true);

      const respuesta = await fetch(`${API_URL}/mascotas/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          especie,
          estado,
          refugio: Number(refugio),
        }),
      });

      if (!respuesta.ok) {
        throw new Error('No se pudo registrar la mascota.');
      }

      const nuevaMascota = await respuesta.json();

      setMascotas((anteriores) => [...anteriores, nuevaMascota]);

      setNombre('');
      setEspecie('');
      setEstado('');
      setRefugio('');

    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  // Eliminar una mascota
  async function eliminarMascota(id) {
    const confirmar = window.confirm(
      '¿Estás segura de eliminar esta mascota?'
    );

    if (!confirmar) return;

    try {
      setError('');

      const respuesta = await fetch(`${API_URL}/mascotas/${id}/`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error('No se pudo eliminar la mascota.');
      }

      setMascotas((anteriores) =>
        anteriores.filter((mascota) => mascota.id !== id)
      );

    } catch (err) {
      setError(err.message);
    }
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

        <button type="submit" disabled={cargando}>
          {cargando ? 'Procesando...' : 'Registrar mascota'}
        </button>
      </form>

      {error && <p>{error}</p>}

      <h3>Mascotas registradas</h3>

      {cargando ? (
        <p>Cargando información...</p>
      ) : mascotas.length === 0 ? (
        <p>No hay mascotas registradas todavía.</p>
      ) : (
        mascotas.map((mascota) => (
          <div key={mascota.id}>
            <p>
              **{mascota.nombre}** - {mascota.especie} - {mascota.estado}
            </p>

            <button
              type="button"
              onClick={() => eliminarMascota(mascota.id)}
            >
              Eliminar
            </button>
          </div>
        ))
      )}
    </section>
  );
}

export default MascotasSection;
