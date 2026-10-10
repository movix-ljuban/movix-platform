import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
const requests = [
  {
    id: "Z-001",
    date: "Danas",
    client: "Plastdent",
    pickup: "Vračar",
    delivery: "Novi Beograd",
    price: "600 RSD",
    status: "Novo",
  },
  {
    id: "Z-002",
    date: "Danas",
    client: "Adea Lab",
    pickup: "Zemun",
    delivery: "Stari grad",
    price: "700 RSD",
    status: "U obradi",
  },
  {
    id: "Z-003",
    date: "Danas",
    client: "IT Mathics",
    pickup: "Dorćol",
    delivery: "Banovo brdo",
    price: "800 RSD",
    status: "Dodeljeno",
  },
];
const getDefaultDeliveryDateTime = () => {
  const now = new Date();

  now.setMinutes(Math.ceil(now.getMinutes() / 5) * 5, 0, 0);

  const localTime = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  );

  return localTime.toISOString().slice(0, 16);
};
const getDateTimePlusMinutes = (minutes) => {
  const date = new Date(getDefaultDeliveryDateTime());
  date.setMinutes(date.getMinutes() + minutes);

  const localTime = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return localTime.toISOString().slice(0, 16);
};

const timeOptions = Array.from({ length: 133 }, (_, index) => {
  const totalMinutes = 8 * 60 + index * 5;
  const hour = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minute = String(totalMinutes % 60).padStart(2, "0");

  return `${hour}:${minute}`;
});

function DateTimeRange({
  title,
  fromValue,
  toValue,
  onChange,
}) {
  const defaultDate = getDefaultDeliveryDateTime().split("T")[0];

  const date =
    fromValue?.split("T")[0] ||
    toValue?.split("T")[0] ||
    defaultDate;

  const fromTime =
    fromValue?.split("T")[1]?.slice(0, 5) || "09:00";

  const toTime =
    toValue?.split("T")[1]?.slice(0, 5) || "10:00";

  return (
    <div className="delivery-range-group">
      <div className="delivery-range-title">{title}</div>

      <label>
        <span>Датум</span>
        <input
          type="date"
          value={date}
          onClick={(e) => e.currentTarget.showPicker?.()}
          onChange={(e) =>
            onChange(
              `${e.target.value}T${fromTime}`,
              `${e.target.value}T${toTime}`
            )
          }
        />
      </label>

      <label>
        <span>Од</span>
        <select
          value={fromTime}
          onChange={(e) =>
            onChange(`${date}T${e.target.value}`, toValue)
          }
        >
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>До</span>
        <select
          value={toTime}
          onChange={(e) =>
            onChange(fromValue, `${date}T${e.target.value}`)
          }
        >
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
function formatDateTimeRange(fromValue, toValue) {
  if (!fromValue) {
    return "Термин није одређен";
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
function Requests({ companyId }) {
 
const [requestList, setRequestList] = useState([]);
const [showForm, setShowForm] = useState(false);
const [newRequest, setNewRequest] = useState({
  client: "",
  pickup: "",
  pickup_contact_name: "",
  pickup_phone: "",
  delivery: "",
  delivery_contact_name: "",
  delivery_phone: "",
  price: "",
  pickup_from_at: getDefaultDeliveryDateTime(),
pickup_to_at: getDateTimePlusMinutes(60),
delivery_from_at: getDateTimePlusMinutes(120),
delivery_to_at: getDateTimePlusMinutes(180),
note: "",
});
useEffect(() => {
  loadRequests();
}, []);

const loadRequests = async () => {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    return;
  }

  setRequestList(data);
};
const deleteRequest = async (id) => {
  const { error } = await supabase
  .from("requests")
  .delete()
  .eq("id", id);

if (error) {
  alert(error.message);
  return;
}

loadRequests();

}
const findOrCreateClient = async (clientName) => {
  const cleanName = clientName.trim();

  const { data: existingClient, error: searchError } = await supabase
    .from("clients")
    .select("id")
    .eq("company_id", companyId)
    .ilike("name", cleanName)
    .maybeSingle();

  if (searchError) {
    throw searchError;
  }

  if (existingClient) {
    return existingClient.id;
  }

  const { data: newClient, error: insertError } = await supabase
    .from("clients")
    .insert([
      {
        company_id: companyId,
        name: cleanName,
        is_active: true,
      },
    ])
    .select("id")
    .single();

  if (insertError) {
    throw insertError;
  }

  return newClient.id;
};
const findOrCreateAddress = async (clientId, addressText, label) => {
  const cleanAddress = addressText.trim();

  const { data: existingAddress, error: searchError } = await supabase
    .from("client_addresses")
    .select("id")
    .eq("client_id", clientId)
    .ilike("address", cleanAddress)
    .maybeSingle();

  if (searchError) {
    throw searchError;
  }

  if (existingAddress) {
    return existingAddress.id;
  }

  const { data: newAddress, error: insertError } = await supabase
    .from("client_addresses")
    .insert([
      {
        client_id: clientId,
        label,
        address: cleanAddress,
        is_active: true,
      },
    ])
    .select("id")
    .single();

  if (insertError) {
    throw insertError;
  }

  return newAddress.id;
};
const convertToDelivery = async (request) => {
  try {
    const clientId = await findOrCreateClient(request.client);

    const pickupAddressId = await findOrCreateAddress(
      clientId,
      request.pickup,
      "Preuzimanje"
    );

    const deliveryAddressId = await findOrCreateAddress(
      clientId,
      request.delivery,
      "Isporuka"
    );

    const { error: deliveryError } = await supabase
      .from("deliveries")
      .insert([
        {
         company_id: companyId,
client_id: clientId,

pickup_address_id: pickupAddressId,
pickup_contact_name: request.pickup_contact_name || null,
pickup_phone: request.pickup_phone || null,

delivery_address_id: deliveryAddressId,
delivery_contact_name: request.delivery_contact_name || null,
delivery_phone: request.delivery_phone || null,
pickup_from_at: request.pickup_from_at || null,
pickup_to_at: request.pickup_to_at || null,
delivery_from_at: request.delivery_from_at || null,
delivery_to_at: request.delivery_to_at || null,

price: Number(request.price),
status: "new",
payment_method: request.payment_method || null,
note: request.note || null,
is_active: true,
        },
      ]);

    if (deliveryError) {
      throw deliveryError;
    }

    await deleteRequest(request.id);
  } catch (error) {
    alert(error.message);
  }
};
const addRequest = async () => {
  if (
  new Date(newRequest.pickup_to_at) <=
  new Date(newRequest.pickup_from_at)
) {
  alert('Време „До“ за преузимање мора бити после времена „Од“.');
  return;
}

if (
  new Date(newRequest.delivery_to_at) <=
  new Date(newRequest.delivery_from_at)
) {
  alert('Време „До“ за испоруку мора бити после времена „Од“.');
  return;
}
  if (
    !newRequest.client ||
    !newRequest.pickup ||
    !newRequest.delivery ||
    !newRequest.price
  ) {
    alert("Popuni sva polja.");
    return;
  }
const { data, error } = await supabase
  .from("requests")
  .insert([
   {
    company_id: companyId,
  client: newRequest.client,

  pickup: newRequest.pickup,
  pickup_contact_name: newRequest.pickup_contact_name,
  pickup_phone: newRequest.pickup_phone,

  delivery: newRequest.delivery,
  delivery_contact_name: newRequest.delivery_contact_name,
  delivery_phone: newRequest.delivery_phone,

  price: Number(newRequest.price),
  pickup_from_at: newRequest.pickup_from_at || null,
pickup_to_at: newRequest.pickup_to_at || null,
delivery_from_at: newRequest.delivery_from_at || null,
delivery_to_at: newRequest.delivery_to_at || null,
requested_delivery_at: newRequest.delivery_from_at || null,
note: newRequest.note.trim() || null,
  status: "Novo",
},
  ]).select().single();

if (error) {
  alert(error.message);
  return;
}
  

  const requestToAdd = data;

setRequestList([...requestList, requestToAdd]);

setNewRequest({
  client: "",
  pickup: "",
  pickup_contact_name: "",
  pickup_phone: "",
  delivery: "",
  delivery_contact_name: "",
  delivery_phone: "",
  price: "",
  pickup_from_at: getDefaultDeliveryDateTime(),
  pickup_to_at: getDateTimePlusMinutes(60),
  delivery_from_at: getDateTimePlusMinutes(120),
  delivery_to_at: getDateTimePlusMinutes(180),
  note: "",
});

  setShowForm(false);
};
  return ( <>
    <section className="requests-section">
      <div className="section-header">
        <div>
          <h2>Zahtevi za dostavu</h2>
          <p>Novi zahtevi koji čekaju obradu ili dodelu kuriru.</p>
        </div>

        <button
  className="primary-button"
  onClick={() => setShowForm(!showForm)}
>
  + Novi zahtev
</button>

      </div>
{showForm && (
  <div className="table-card">
    <h3>Novi zahtev</h3>
    <input
  type="text"
  placeholder="Klijent"
  value={newRequest.client}
  onChange={(e) =>
    setNewRequest({ ...newRequest, client: e.target.value })
  }
/>
  <input
  type="text"
  placeholder="Preuzimanje"
  value={newRequest.pickup}
  onChange={(e) =>
    setNewRequest({ ...newRequest, pickup: e.target.value })
  }
/> 
<input
  type="text"
  placeholder="Ime pošiljaoca"
  value={newRequest.pickup_contact_name}
  onChange={(e) =>
    setNewRequest({
      ...newRequest,
      pickup_contact_name: e.target.value,
    })
  }
/>

<input
  type="tel"
  placeholder="Telefon pošiljaoca"
  value={newRequest.pickup_phone}
  onChange={(e) =>
    setNewRequest({
      ...newRequest,
      pickup_phone: e.target.value,
    })
  }
/>
  <input
  type="text"
  placeholder="Isporuka"
  value={newRequest.delivery}
  onChange={(e) =>
    setNewRequest({ ...newRequest, delivery: e.target.value })
  }
/>
<input
  type="text"
  placeholder="Ime primaoca"
  value={newRequest.delivery_contact_name}
  onChange={(e) =>
    setNewRequest({
      ...newRequest,
      delivery_contact_name: e.target.value,
    })
  }
/>

<input
  type="tel"
  placeholder="Telefon primaoca"
  value={newRequest.delivery_phone}
  onChange={(e) =>
    setNewRequest({
      ...newRequest,
      delivery_phone: e.target.value,
    })
  }
/>
   <input
  type="text"
  placeholder="Cena"
  value={newRequest.price}
  onChange={(e) =>
    setNewRequest({ ...newRequest, price: e.target.value })
  }
/>
<div className="delivery-datetime-row">
  <DateTimeRange
    title="Термин преузимања"
    fromValue={newRequest.pickup_from_at}
    toValue={newRequest.pickup_to_at}
    onChange={(from, to) =>
      setNewRequest({
        ...newRequest,
        pickup_from_at: from,
        pickup_to_at: to,
      })
    }
  />

  <DateTimeRange
    title="Термин испоруке"
    fromValue={newRequest.delivery_from_at}
    toValue={newRequest.delivery_to_at}
    onChange={(from, to) =>
      setNewRequest({
        ...newRequest,
        delivery_from_at: from,
        delivery_to_at: to,
      })
    }
  />
</div>

<textarea
  placeholder="Напомена за испоруку"
  value={newRequest.note}
  onChange={(e) =>
    setNewRequest({
      ...newRequest,
      note: e.target.value,
    })
  }
/>
  <button
  className="primary-button"
  onClick={addRequest}
>
  Sačuvaj zahtev
</button>
  </div>
 
)}
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
              <th>Akcija</th>
            </tr>
          </thead>

          <tbody>
            {requestList.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                
                <td>
  <div>{request.client}</div>

  {request.note && (
    <div
      className="delivery-note"
      title={request.note}
    >
      Nap: {request.note}
    </div>
  )}
</td>
                <td>
  <div className="request-address">{request.pickup}</div>
  <div className="request-time">
    {formatDateTimeRange(
      request.pickup_from_at,
      request.pickup_to_at
    )}
  </div>
</td>

<td>
  <div className="request-address">{request.delivery}</div>
  <div className="request-time">
    {formatDateTimeRange(
      request.delivery_from_at,
      request.delivery_to_at
    )}
  </div>
</td>
                <td>{request.price}</td>
                <td>
                  <span className="status-badge">{request.status}</span>
                </td>
                <td>
  <button
    className="small-button"
    onClick={() => convertToDelivery(request)}
  >
    Pretvori u dostavu
  </button>

  <button
    className="small-button"
    onClick={() => deleteRequest(request.id)}
  >
    Obriši
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </>
);
}

export default Requests;