import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const emptyCourier = {
  full_name: "",
  email: "",
  phone: "",
  vehicle_type: "",
  vehicle_plate: "",
  note: "",
};

function Couriers({ companyId }) {
  const [couriers, setCouriers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingHasAccount, setEditingHasAccount] =
    useState(false);
  const [courierForm, setCourierForm] =
    useState(emptyCourier);

  useEffect(() => {
    if (companyId) {
      loadCouriers();
    }
  }, [companyId]);

  const loadCouriers = async () => {
    const { data, error } = await supabase
      .from("users")
      .select(`
        id,
        full_name,
        email,
        phone,
        vehicle_type,
        vehicle_plate,
        note,
        is_active,
        auth_user_id
      `)
      .eq("company_id", companyId)
      .eq("role", "courier")
      .order("is_active", { ascending: false })
      .order("full_name", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setCouriers(data || []);
  };

  const openNewCourierForm = () => {
    setEditingId(null);
    setEditingHasAccount(false);
    setCourierForm(emptyCourier);
    setShowForm(true);
  };

  const editCourier = (courier) => {
    setEditingId(courier.id);
    setEditingHasAccount(Boolean(courier.auth_user_id));

    setCourierForm({
      full_name: courier.full_name || "",
      email: courier.email || "",
      phone: courier.phone || "",
      vehicle_type: courier.vehicle_type || "",
      vehicle_plate: courier.vehicle_plate || "",
      note: courier.note || "",
    });

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setEditingHasAccount(false);
    setCourierForm(emptyCourier);
  };

  const saveCourier = async () => {
    const cleanName = courierForm.full_name.trim();

    if (!cleanName) {
      alert("Unesi ime kurira.");
      return;
    }

    const courierData = {
      full_name: cleanName,
      phone: courierForm.phone.trim() || null,
      vehicle_type:
        courierForm.vehicle_type.trim() || null,
      vehicle_plate:
        courierForm.vehicle_plate.trim() || null,
      note: courierForm.note.trim() || null,
    };

    let error;

    if (editingId) {
      if (!editingHasAccount) {
        courierData.email =
          courierForm.email.trim() || null;
      }

      const result = await supabase
        .from("users")
        .update(courierData)
        .eq("id", editingId);

      error = result.error;
    } else {
      const result = await supabase
        .from("users")
        .insert([
          {
            company_id: companyId,
            ...courierData,
            email: courierForm.email.trim() || null,
            role: "courier",
            is_active: true,
            auth_user_id: null,
          },
        ]);

      error = result.error;
    }

    if (error) {
      alert(error.message);
      return;
    }

    closeForm();
    loadCouriers();
  };

  const toggleCourier = async (courier) => {
    const { error } = await supabase
      .from("users")
      .update({
        is_active: !courier.is_active,
      })
      .eq("id", courier.id);

    if (error) {
      alert(error.message);
      return;
    }

    loadCouriers();
  };

  return (
    <section className="couriers-section">
      <div className="section-header">
        <div>
          <h2>Kuriri</h2>
          <p>
            Pregled kurira, vozila i pristupa platformi.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openNewCourierForm}
        >
          + Novi kurir
        </button>
      </div>

      {showForm && (
        <div className="table-card courier-form">
          <h3>
            {editingId
              ? "Izmeni podatke kurira"
              : "Novi kurir"}
          </h3>

          <input
            type="text"
            placeholder="Ime i prezime"
            value={courierForm.full_name}
            onChange={(e) =>
              setCourierForm({
                ...courierForm,
                full_name: e.target.value,
              })
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={courierForm.email}
            disabled={editingHasAccount}
            onChange={(e) =>
              setCourierForm({
                ...courierForm,
                email: e.target.value,
              })
            }
          />

          <input
            type="tel"
            placeholder="Telefon"
            value={courierForm.phone}
            onChange={(e) =>
              setCourierForm({
                ...courierForm,
                phone: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Vrsta vozila"
            value={courierForm.vehicle_type}
            onChange={(e) =>
              setCourierForm({
                ...courierForm,
                vehicle_type: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Registracija vozila"
            value={courierForm.vehicle_plate}
            onChange={(e) =>
              setCourierForm({
                ...courierForm,
                vehicle_plate: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Napomena"
            value={courierForm.note}
            onChange={(e) =>
              setCourierForm({
                ...courierForm,
                note: e.target.value,
              })
            }
          />

          {editingHasAccount && (
            <p className="courier-form-note">
              Email naloga za prijavu ne menja se na
              ovoj stranici.
            </p>
          )}

          <div className="courier-form-actions">
            <button
              className="primary-button"
              onClick={saveCourier}
            >
              {editingId
                ? "Sačuvaj izmene"
                : "Sačuvaj kurira"}
            </button>

            <button
              className="small-button"
              onClick={closeForm}
            >
              Otkaži
            </button>
          </div>
        </div>
      )}

      <div className="table-card">
        {couriers.length === 0 ? (
          <p className="empty-message">
            Firma još nema kurire.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Kurir</th>
                <th>Telefon</th>
                <th>Vozilo</th>
                <th>Registracija</th>
                <th>Nalog</th>
                <th>Status</th>
                <th>Akcija</th>
              </tr>
            </thead>

            <tbody>
              {couriers.map((courier) => (
                <tr key={courier.id}>
                  <td>{courier.id}</td>

                  <td>
                    <strong>{courier.full_name}</strong>

                    {courier.email && (
                      <small className="courier-email">
                        {courier.email}
                      </small>
                    )}
                  </td>

                  <td>{courier.phone || "—"}</td>
                  <td>{courier.vehicle_type || "—"}</td>
                  <td>{courier.vehicle_plate || "—"}</td>

                  <td>
                    {courier.auth_user_id
                      ? "Aktivan nalog"
                      : "Bez naloga"}
                  </td>

                  <td>
                    <span
                      className={
                        courier.is_active
                          ? "courier-status active"
                          : "courier-status inactive"
                      }
                    >
                      {courier.is_active
                        ? "Aktivan"
                        : "Neaktivan"}
                    </span>
                  </td>

                  <td>
                    <button
                      className="small-button"
                      onClick={() => editCourier(courier)}
                    >
                      Izmeni
                    </button>

                    <button
                      className="small-button"
                      onClick={() =>
                        toggleCourier(courier)
                      }
                    >
                      {courier.is_active
                        ? "Deaktiviraj"
                        : "Aktiviraj"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default Couriers;