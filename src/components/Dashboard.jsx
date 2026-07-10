function Dashboard() {
  return (
    <section className="dashboard-content">
      <div className="stats-grid">
        <div className="stat-card">
          <p>Današnji zahtevi</p>
          <h2>24</h2>
        </div>

        <div className="stat-card">
          <p>Aktivne dostave</p>
          <h2>18</h2>
        </div>

        <div className="stat-card">
          <p>Aktivni kuriri</p>
          <h2>4</h2>
        </div>

        <div className="stat-card">
          <p>Klijenti firme</p>
          <h2>126</h2>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;