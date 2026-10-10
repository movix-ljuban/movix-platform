function Sidebar({ activePage, setActivePage }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "requests", label: "Zahtevi" },
    { id: "deliveries", label: "Dostave" },
    { id: "couriers", label: "Kuriri" },
    { id: "clients", label: "Klijenti" },
    { id: "company", label: "Firma" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <strong>MOVIX</strong>
        <p>Transport & Service Platform</p>
      </div>

      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setActivePage(item.id)}
                className={activePage === item.id ? "active" : ""}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;