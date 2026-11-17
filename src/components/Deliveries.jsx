import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function formatDateTimeRange(fromValue, toValue) {
  if (!fromValue) {
    return "Termin nije određen";
  }

  const fromDate = new Date(fromValue);
  const toDate = toValue ? new Date(toValue) : null;

  const date = fromDate.toLocaleDateString("sr-RS", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const fromTime = fromDate.toLocaleTimeString("sr-RS", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const toTime = toDate
    ? toDate.toLocaleTimeString("sr-RS", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return toTime
    ? `${date} ${fromTime}–${toTime}`
    : `${date} ${fromTime}`;
}
function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadDeliveries();
    loadCouriers();
  }, []);

  const loadDeliveries = async () => {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("deliveries")
      .select(`
        id,
        created_at,
        price,
        status,
        payment_method,
        payment_payer,
        note,
        pickup_from_at,
pickup_to_at,
delivery_from_at,
delivery_to_at,
        courier_id,
courier:users(full_name),
        client:clients(name),
        pickup_address:client_addresses!deliveries_pickup_address_id_fkey(address),
        delivery_address:client_addresses!deliveries_delivery_address_id_fkey(address)
      `)
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setDeliveries(data || []);
    setLoading(false);
  };

  const loadCouriers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name")
    .eq("role", "courier")
    .eq("is_active", true)
    .order("full_name", { ascending: true });

  if (error) {
    console.error(error);
    setErrorMessage(error.message);
    return;
  }

  setCouriers(data || []);
};
const assignCourier = async (deliveryId, courierId) => {
  setErrorMessage("");

  const { error } = await supabase
    .from("deliveries")
    .update({
      courier_id: courierId ? Number(courierId) : null,
    })
    .eq("id", deliveryId)
    .select("id")
    .single();

  if (error) {
    console.error(error);
    setErrorMessage(error.message);
    return;
  }

  await loadDeliveries();
};

const updateDeliveryStatus = async (deliveryId, status) => {
  setErrorMessage("");

  const { error } = await supabase
    .from("deliveries")
    .update({ status })
    .eq("id", deliveryId)
    .select("id")
    .single();

  if (error) {
    console.error(error);
    setErrorMessage(error.message);
    return;
  }

  await loadDeliveries();
};
  if (loading) {
    return <p>Učitavanje dostava...</p>;
  }

  if (errorMessage) {
    return <p>Greška: {errorMessage}</p>;
  }

  return (
    <section>
      <div className="section-header">
        <div>
          <h2>Dostave</h2>
          <p>Pregled svih kreiranih dostava.</p>
        </div>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              
              <th>Klijent</th>
              <th>Preuzimanje</th>
              <th>Isporuka</th>
              <th>Cena</th>
              <th>Status</th>
              <th>Plaćanje</th>
              <th>Kurir</th>
            </tr>
          </thead>

          <tbody>
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan="8">Nema dostava.</td>
                </tr>
            ) : (
              deliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td>{delivery.id}</td>
                  
                  <td>
  <div>{delivery.client?.name || "-"}</div>

  {delivery.note && (
    <div
  className="delivery-note"
  title={delivery.note}
>
  Nap: {delivery.note}
</div>
  )}
</td>
                  <td>
  <div className="request-address">
    {delivery.pickup_address?.address || "-"}
  </div>
  <div className="request-time">
    {formatDateTimeRange(
      delivery.pickup_from_at,
      delivery.pickup_to_at
    )}
  </div>
</td>

<td>
  <div className="request-address">
    {delivery.delivery_address?.address || "-"}
  </div>
  <div className="request-time">
    {formatDateTimeRange(
      delivery.delivery_from_at,
      delivery.delivery_to_at
    )}
  </div>
</td>
                  <td>{delivery.price ? `${delivery.price} RSD` : "-"}</td>
                  <td>
                    <select
  className={`status-select status-${delivery.status || "new"}`}
  value={delivery.status || "new"}
  onChange={(event) =>
    updateDeliveryStatus(delivery.id, event.target.value)
  }
>
  <option value="new">Novo</option>
  <option value="picked_up">Preuzeto</option>
  <option value="paid">Naplaćeno</option>
  <option value="delivered">Isporučeno</option>
</select>
                  </td>
                  <td>
  <div className="request-payment">
    <strong>
      {({ cash: "KEŠ", invoice: "RAČUN" })[
        delivery.payment_method
      ] || "—"}
    </strong>

    <span>
      {({ sender: "Pošiljalac", recipient: "Primalac" })[
        delivery.payment_payer
      ] || "—"}
    </span>
  </div>
</td>
                  <td>
  <select
    value={delivery.courier_id || ""}
    onChange={(event) =>
      assignCourier(delivery.id, event.target.value)
    }
  >
    <option value="">Nedodeljena</option>
    {couriers.map((courier) => (
      <option key={courier.id} value={courier.id}>
        {courier.full_name}
      </option>
    ))}
  </select>
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Deliveries;