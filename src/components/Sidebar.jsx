function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-circle">M</div>
        <h2>MOVIX</h2>
        <p>Transport & Service Platform</p>
      </div>

      <nav>
        <ul>
          <li className="active">Dashboard</li>
          <li>Zahtevi</li>
          <li>Dostave</li>
          <li>Kuriri</li>
          <li>Klijenti</li>
          <li>Firme</li>
          <li>Statistika</li>
          <li>Podešavanja</li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;