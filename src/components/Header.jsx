import { supabase } from "../lib/supabase";

function Header({
  companyName,
  logoUrl,
  activePage,
}) {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      alert("Odjava nije uspela. Pokušaj ponovo.");
    }
  };

  const pageInfo = {
    dashboard: {
      title: "Dashboard",
      description: `Pregled aktivnosti za firmu ${companyName}`,
    },
    requests: {
      title: "Zahtevi",
      description: "Prijem i obrada zahteva za dostavu.",
    },
    deliveries: {
      title: "Dostave",
      description: "Pregled i upravljanje dostavama.",
    },
    couriers: {
      title: "Kuriri",
      description: "Kuriri, vozila i pristup platformi.",
    },
    clients: {
      title: "Klijenti",
      description: "Klijenti firme i njihove adrese.",
    },
    company: {
      title: "Firma",
      description: "Podaci, kontakt i status vaše firme.",
    },
  };

  const currentPage =
    pageInfo[activePage] || pageInfo.dashboard;

  return (
    <header className="header">
      <div>
        <h1>{currentPage.title}</h1>
        <p>{currentPage.description}</p>
      </div>

      <div className="user-info">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`Logo ${companyName}`}
            className="header-company-logo"
          />
        ) : (
          <span className="header-company-logo-fallback">
            {companyName?.slice(0, 2).toUpperCase()}
          </span>
        )}

        <span>{companyName}</span>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Odjavi se
        </button>
      </div>
    </header>
  );
}

export default Header;