import { Fragment, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Clients({ companyId }) {
  const [clients, setClients] = useState([]);
  const [showClientForm, setShowClientForm] = useState(false);
  const [expandedClientId, setExpandedClientId] = useState(null);
  const [addressClientId, setAddressClientId] = useState(null);

  const [newClient, setNewClient] = useState({
    name: "",
    main_phone: "",
    note: "",
  });

  const [newAddress, setNewAddress] = useState({
    label: "",
    address: "",
    city: "",
    note: "",
  });

  useEffect(() => {
    if (companyId) {
      loadClients();
    }
  }, [companyId]);

  const loadClients = async () => {
    const { data, error } = await supabase
      .from("clients")
      .select(`
        id,
        name,
        main_phone,
        note,
        is_active,
        client_addresses (
          id,
          label,
          address,
          city,
          note,
          is_active
        )
      `)
      .eq("company_id", companyId)
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setClients(data || []);
  };

  const addClient = async () => {
    const cleanName = newClient.name.trim();

    if (!cleanName) {
      alert("Unesi naziv klijenta.");
      return;
    }

    const { error } = await supabase
      .from("clients")
      .insert([
        {
          company_id: companyId,
          name: cleanName,
          main_phone: newClient.main_phone.trim() || null,
          note: newClient.note.trim() || null,
          is_active: true,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    setNewClient({
      name: "",
      main_phone: "",
      note: "",
    });

    setShowClientForm(false);
    loadClients();
  };

  const addAddress = async (clientId) => {
    const cleanAddress = newAddress.address.trim();

    if (!cleanAddress) {
      alert("Unesi adresu.");
      return;
    }

    const { error } = await supabase
      .from("client_addresses")
      .insert([
        {
          client_id: clientId,
          label: newAddress.label.trim() || "Adresa",
          address: cleanAddress,
          city: newAddress.city.trim() || null,
          note: newAddress.note.trim() || null,
          is_active: true,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    setNewAddress({
      label: "",
      address: "",
      city: "",
      note: "",
    });

    setAddressClientId(null);
    loadClients();
  };

  const toggleClient = (clientId) => {
    setExpandedClientId(
      expandedClientId === clientId ? null : clientId
    );

    setAddressClientId(null);
  };

  return (
    <section className="clients-section">
      <div className="section-header">
        <div>
          <h2>Klijenti</h2>
          <p>Pregled klijenata i njihovih adresa.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowClientForm(!showClientForm)}
        >
          + Novi klijent
        </button>
      </div>

      {showClientForm && (
        <div className="table-card client-form">
          <h3>Novi klijent</h3>

          <input
            type="text"
            placeholder="Naziv klijenta"
            value={newClient.name}
            onChange={(e) =>
              setNewClient({
                ...newClient,
                name: e.target.value,
              })
            }
          />

          <input
            type="tel"
            placeholder="Glavni telefon"
            value={newClient.main_phone}
            onChange={(e) =>
              setNewClient({
                ...newClient,
                main_phone: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Napomena"
            value={newClient.note}
            onChange={(e) =>
              setNewClient({
                ...newClient,
                note: e.target.value,
              })
            }
          />

          <button
            className="primary-button"
            onClick={addClient}
          >
            Sačuvaj klijenta
          </button>
        </div>
      )}

      <div className="table-card">
        {clients.length === 0 ? (
          <p className="empty-message">Nema klijenata.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Klijent</th>
                <th>Telefon</th>
                <th>Napomena</th>
                <th>Adrese</th>
                <th>Akcija</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => {
                const addresses =
                  client.client_addresses?.filter(
                    (address) => address.is_active !== false
                  ) || [];

                return (
                  <Fragment key={client.id}>
                    <tr>
                      <td>{client.id}</td>
                      <td>{client.name}</td>
                      <td>{client.main_phone || "—"}</td>
                      <td>{client.note || "—"}</td>
                      <td>{addresses.length}</td>
                      <td>
                        <button
                          className="small-button"
                          onClick={() => toggleClient(client.id)}
                        >
                          {expandedClientId === client.id
                            ? "Zatvori"
                            : "Prikaži"}
                        </button>
                      </td>
                    </tr>

                    {expandedClientId === client.id && (
                      <tr className="client-details-row">
                        <td colSpan="6">
                          <div className="client-details">
                            <div className="client-details-header">
                              <h3>Adrese klijenta</h3>

                              <button
                                className="small-button"
                                onClick={() =>
                                  setAddressClientId(
                                    addressClientId === client.id
                                      ? null
                                      : client.id
                                  )
                                }
                              >
                                + Dodaj adresu
                              </button>
                            </div>

                            {addresses.length === 0 ? (
                              <p className="empty-message">
                                Klijent nema sačuvane adrese.
                              </p>
                            ) : (
                              <div className="address-list">
                                {addresses.map((address) => (
                                  <div
                                    className="address-card"
                                    key={address.id}
                                  >
                                    <strong>
                                      {address.label || "Adresa"}
                                    </strong>

                                    <span>{address.address}</span>

                                    {address.city && (
                                      <span>{address.city}</span>
                                    )}

                                    {address.note && (
                                      <small>{address.note}</small>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {addressClientId === client.id && (
                              <div className="address-form">
                                <input
                                  type="text"
                                  placeholder="Naziv adrese, npr. Centrala"
                                  value={newAddress.label}
                                  onChange={(e) =>
                                    setNewAddress({
                                      ...newAddress,
                                      label: e.target.value,
                                    })
                                  }
                                />

                                <input
                                  type="text"
                                  placeholder="Adresa"
                                  value={newAddress.address}
                                  onChange={(e) =>
                                    setNewAddress({
                                      ...newAddress,
                                      address: e.target.value,
                                    })
                                  }
                                />

                                <input
                                  type="text"
                                  placeholder="Grad"
                                  value={newAddress.city}
                                  onChange={(e) =>
                                    setNewAddress({
                                      ...newAddress,
                                      city: e.target.value,
                                    })
                                  }
                                />

                                <input
                                  type="text"
                                  placeholder="Napomena za adresu"
                                  value={newAddress.note}
                                  onChange={(e) =>
                                    setNewAddress({
                                      ...newAddress,
                                      note: e.target.value,
                                    })
                                  }
                                />

                                <button
                                  className="primary-button"
                                  onClick={() => addAddress(client.id)}
                                >
                                  Sačuvaj adresu
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default Clients;