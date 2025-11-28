import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/postconsulta-recompensas.css";
import {
  getFollowups,
  createFollowup,
  updateFollowup,
} from "../../api/postconsultService";
import { listRewards } from "../../api/rewardsService";

const defaultFollowupState = {
  pet_name: "",
  owner_name: "",
  type: "",
  date: "",
  time: "",
};

const FollowupsBoard = ({ mode = "client" }) => {
  const navigate = useNavigate();
  const isDoctorView = mode === "doctor";
  const isClientView = mode === "client";

  const headerTitle = isDoctorView
    ? "Seguimiento clínico de pacientes"
    : "Seguimiento Post-Consulta & Recompensas";
  const headerSubtitle = isDoctorView
    ? "Gestiona recordatorios, encuestas y tareas pendientes para cada mascota."
    : "Automatiza el seguimiento posterior y fideliza a tus clientes con puntos y premios.";

  const [followData, setFollowData] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showNewFollowModal, setShowNewFollowModal] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [selectedFollow, setSelectedFollow] = useState(null);
  const [newFollow, setNewFollow] = useState(defaultFollowupState);
  const [surveyData, setSurveyData] = useState({ rating: "", comment: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [followupsRes, rewardsRes] = await Promise.all([
          getFollowups(),
          isClientView ? listRewards() : Promise.resolve([]),
        ]);
        setFollowData(followupsRes);
        setRewards(rewardsRes);
        setError(null);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("No se pudieron cargar los datos de seguimiento.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isClientView]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());

  const filteredFollowData = useMemo(() => {
    return followData.filter((f) => {
      const label = `${f.pet_name ?? ""} — ${f.owner_name ?? ""}`.toLowerCase();
      const matchesSearch =
        label.includes(searchTerm) ||
        f.type?.toLowerCase().includes(searchTerm) ||
        f.status?.toLowerCase().includes(searchTerm);
      const matchesFilter = filterStatus ? f.status === filterStatus : true;
      return matchesSearch && matchesFilter;
    });
  }, [followData, searchTerm, filterStatus]);

  const handleFilter = () => {
    const status = prompt(
      "Filtrar por estado (Pendiente, Enviado recordatorio, Completado):"
    );
    if (status) setFilterStatus(status);
  };

  const handleOpenNewFollow = () => {
    setShowNewFollowModal(true);
    setNewFollow(defaultFollowupState);
  };

  const handleSaveNewFollow = async () => {
    const { pet_name, owner_name, type, date, time } = newFollow;
    if (!pet_name || !owner_name || !type || !date || !time) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const payload = {
        ...newFollow,
        status: "Pendiente",
        notes: "Nuevo seguimiento",
        pointsOnComplete: 50,
      };
      const created = await createFollowup(payload);
      setFollowData((prev) => [...prev, created]);
      setShowNewFollowModal(false);
    } catch (err) {
      console.error("Error al guardar seguimiento:", err);
      alert("No se pudo guardar el seguimiento. Intenta de nuevo.");
    }
  };

  const markComplete = async (id) => {
    try {
      const updated = await updateFollowup(id, { status: "Completado" });
      setFollowData((prev) => prev.map((f) => (f.id === id ? updated : f)));
    } catch (err) {
      console.error("Error al marcar como completado:", err);
      alert("No se pudo actualizar el seguimiento.");
    }
  };

  const handleOpenSurvey = (follow) => {
    setSelectedFollow(follow);
    setSurveyData({ rating: "", comment: "" });
    setShowSurveyModal(true);
  };

  const handleSaveSurvey = async () => {
    const { rating, comment } = surveyData;
    if (!rating) {
      alert("Por favor, selecciona una calificación.");
      return;
    }

    const updatedNotes = `⭐ ${rating} estrellas — ${comment || "Sin comentario"}`;

    try {
      const updated = await updateFollowup(selectedFollow.id, {
        notes: updatedNotes,
      });
      setFollowData((prev) =>
        prev.map((f) => (f.id === selectedFollow.id ? updated : f))
      );
      setShowSurveyModal(false);
      alert("Gracias por tu valoración 😊");
    } catch (err) {
      console.error("Error al guardar encuesta:", err);
      alert("No se pudo guardar tu encuesta.");
    }
  };

  const getAvatar = (follow) => {
    const base = follow.pet_name || follow.owner_name || "PT";
    return base.slice(0, 2).toUpperCase();
  };

  const getLabel = (follow) => {
    if (isDoctorView) {
      return follow.pet_name ?? "Mascota";
    }
    return `${follow.pet_name ?? "Mascota"} — ${follow.owner_name ?? "Cliente"}`;
  };

  const getOwnerLabel = (follow) =>
    isDoctorView ? `Tutor: ${follow.owner_name ?? "Sin registrar"}` : follow.type;

  return (
    <div className="app postconsulta">
      <header>
        <div className="logo">PT</div>
        <div>
          <h1>{headerTitle}</h1>
          <p>{headerSubtitle}</p>
        </div>
      </header>

      <main className="card seguimiento">
        <h2>{isDoctorView ? "Agenda de Seguimientos" : "Seguimiento Post-Consulta"}</h2>
        <div className="controls">
          <input
            id="search"
            type="search"
            placeholder="Buscar por mascota, dueño o estado..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {isDoctorView && (
            <button className="btn small" onClick={handleOpenNewFollow}>
              + Nuevo seguimiento
            </button>
          )}
          <button className="btn secondary small" onClick={handleFilter}>
            Filtrar
          </button>
        </div>

        {loading && <p>Cargando seguimientos...</p>}
        {error && <p className="error">{error}</p>}

        <section className="follow-list">
          {!loading &&
            filteredFollowData.map((f) => (
              <div key={f.id} className="follow-item">
                <div className="avatar">{getAvatar(f)}</div>
                <div className="meta">
                  <h3>{getLabel(f)}</h3>
                  <p>
                    {getOwnerLabel(f)} • {f.date} {f.time}
                  </p>
                  <div className="tag">{f.notes}</div>
                </div>
                <div className="right-actions">
                  <div className={f.status === "Completado" ? "pill" : "danger-pill"}>
                    {f.status}
                  </div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                    {isClientView && (
                      <button
                        className="btn secondary small"
                        onClick={() => handleOpenSurvey(f)}
                      >
                        Encuesta
                      </button>
                    )}
                    {isDoctorView && (
                      <button className="btn small" onClick={() => markComplete(f.id)}>
                        Marcar completado
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </section>

        {isClientView && (
          <button
            className="btn"
            style={{ marginTop: "10px" }}
            onClick={() => navigate("/user/rewards")}
          >
            Ver catálogo de recompensas →
          </button>
        )}
      </main>

      {isClientView && (
        <aside className="card rewards">
          <h2>Fidelización y Recompensas</h2>
          <p className="muted">Puntos acumulados y catálogo de premios</p>

          <div className="balance">
            <div className="coin">P</div>
            <div>
              <div style={{ fontSize: "13px", color: "var(--muted)" }}>
                Saldo de puntos
              </div>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>
                1,460{" "}
                <span style={{ fontSize: "13px", color: "var(--muted)", fontWeight: "600" }}>
                  pts
                </span>
              </div>
            </div>
          </div>

          <div className="reward-list">
            {rewards.map((r) => (
              <div key={r.id} className="reward-card">
                <img src={r.img} alt={r.title} />
                <div className="info">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "800" }}>{r.title}</div>
                      <div style={{ color: "var(--muted)", fontSize: "13px" }}>{r.desc}</div>
                    </div>
                    <div style={{ fontWeight: "800", color: "var(--primary)" }}>
                      {r.cost} pts
                    </div>
                  </div>
                  <button className="btn">Canjear</button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}

      {isDoctorView && showNewFollowModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Nuevo seguimiento</h3>
            <input
              type="text"
              placeholder="Nombre de la mascota"
              value={newFollow.pet_name}
              onChange={(e) => setNewFollow({ ...newFollow, pet_name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Nombre del dueño"
              value={newFollow.owner_name}
              onChange={(e) => setNewFollow({ ...newFollow, owner_name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Proceso o tipo de seguimiento"
              value={newFollow.type}
              onChange={(e) => setNewFollow({ ...newFollow, type: e.target.value })}
            />
            <input
              type="date"
              value={newFollow.date}
              onChange={(e) => setNewFollow({ ...newFollow, date: e.target.value })}
            />
            <input
              type="time"
              value={newFollow.time}
              onChange={(e) => setNewFollow({ ...newFollow, time: e.target.value })}
            />

            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setShowNewFollowModal(false)}>
                Cancelar
              </button>
              <button className="btn" onClick={handleSaveNewFollow}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {isClientView && showSurveyModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Encuesta de satisfacción</h3>
            <label>Calificación (1 a 5 estrellas):</label>
            <select
              value={surveyData.rating}
              onChange={(e) => setSurveyData({ ...surveyData, rating: e.target.value })}
            >
              <option value="">Seleccionar...</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} ⭐
                </option>
              ))}
            </select>
            <textarea
              placeholder="Comentarios adicionales..."
              value={surveyData.comment}
              onChange={(e) => setSurveyData({ ...surveyData, comment: e.target.value })}
            />
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setShowSurveyModal(false)}>
                Cancelar
              </button>
              <button className="btn" onClick={handleSaveSurvey}>
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowupsBoard;

