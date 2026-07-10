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

function Requests() {
  return (
    <section className="requests-section">
      <div className="section-header">
        <div>
          <h2>Zahtevi za dostavu</h2>
          <p>Novi zahtevi koji čekaju obradu ili dodelu kuriru.</p>
        </div>

        <button className="primary-button">+ Novi zahtev</button>
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Datum</th>
              <th>Klijent</th>
              <th>Preuzimanje</th>
              <th>Isporuka</th>
              <th>Cena</th>
              <th>Status</th>
              <th>Akcija</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.date}</td>
                <td>{request.client}</td>
                <td>{request.pickup}</td>
                <td>{request.delivery}</td>
                <td>{request.price}</td>
                <td>
                  <span className="status-badge">{request.status}</span>
                </td>
                <td>
                  <button className="small-button">Preuzmi</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Requests;