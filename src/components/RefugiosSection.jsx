import { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000/api/refugios/";

export default function RefugiosSection() {
  const [refugios, setRefugios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  // 1. LISTAR (GET)
  const cargarRefugios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      setRefugios(data);
    } catch (err) {
      setError("No se pudieron cargar los refugios: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRefugios();
  }, []);

  // 2. CREAR (POST) Y EDITAR (PATCH - BONUS)
  const manejarSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      nombre,
      direccion,
      telefono,
      capacidad: Number(capacidad),
    };

    try {
      const url = editandoId ? `${API_URL}${editandoId}/` : API_URL;
      const method = editandoId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el refugio");
      }

      limpiarFormulario();
      cargarRefugios();
    } catch (err) {
      setError(err.message);
    }
  };

  // 3. ELIMINAR (DELETE)
  const eliminarRefugio = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este refugio?")) return;
    setError(null);

    try {
      const response = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("No se pudo eliminar el refugio");
      }
      setRefugios(refugios.filter((ref) => ref.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const iniciarEdicion = (refugio) => {
    setEditandoId(refugio.id);
    setNombre(refugio.nombre);
    setDireccion(refugio.direccion);
    setTelefono(refugio.telefono);
    setCapacidad(refugio.capacidad);
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setNombre("");
    setDireccion("");
    setTelefono("");
    setCapacidad("");
  };

  return (
    <section className="refugios-section">
      <h2>Gestión de Refugios</h2>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      <form onSubmit={manejarSubmit}>
        <input
          type="text"
          placeholder="Nombre del refugio"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Capacidad"
          value={capacidad}
          onChange={(e) => setCapacidad(e.target.value)}
          required
        />
        <button type="submit">
          {editandoId ? "Actualizar Refugio" : "Agregar Refugio"}
        </button>
        {editandoId && (
          <button type="button" onClick={limpiarFormulario}>
            Cancelar
          </button>
        )}
      </form>

      {loading ? (
        <p>Cargando refugios...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Capacidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {refugios.map((refugio) => (
              <tr key={refugio.id}>
                <td>{refugio.id}</td>
                <td>{refugio.nombre}</td>
                <td>{refugio.direccion}</td>
                <td>{refugio.telefono}</td>
                <td>{refugio.capacidad}</td>
                <td>
                  <button onClick={() => iniciarEdicion(refugio)}>Editar</button>
                  <button onClick={() => eliminarRefugio(refugio.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}