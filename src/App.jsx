import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./lib/supabase";
import Login from "./components/Login";
import RegisterCompany from "./components/RegisterCompany";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import CompanyProfile from "./components/CompanyProfile";
import Requests from "./components/Requests";
import Deliveries from "./components/Deliveries";
import Clients from "./components/Clients";
import Couriers from "./components/Couriers";
function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [showRegister, setShowRegister] = useState(false);
  const [session, setSession] = useState(null);
const [authLoading, setAuthLoading] = useState(true);
const [profile, setProfile] = useState(null);
const [profileLoading, setProfileLoading] = useState(false);
const [profileError, setProfileError] = useState("");
useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setSession(data.session);
    setAuthLoading(false);
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, nextSession) => {
    setSession(nextSession);
    setAuthLoading(false);
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);

useEffect(() => {
  const loadProfile = async () => {
    if (!session) {
      setProfile(null);
      setProfileError("");
      setProfileLoading(false);
      return;
    }

    setProfileLoading(true);
    setProfileError("");

    const { data, error } = await supabase
      .from("users")
      .select("id, company_id, full_name, email, role, is_active, companies(name, is_active, logo_path)")
      
      .eq("auth_user_id", session.user.id)
      .maybeSingle();

    if (error) {
      console.error(error);
      setProfile(null);
      setProfileError("Nije moguće učitati korisnički nalog.");
    } else if (!data) {
      setProfile(null);
      setProfileError(
        "Korisnički nalog nije povezan sa platformom."
      );
    } else {
      setProfile(data);
    }

    setProfileLoading(false);
  };

  loadProfile();
}, [session]);

const handleAccountLogout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    alert("Odjava nije uspela. Pokušaj ponovo.");
  }
};
  if (authLoading) {
  return <div className="auth-loading">Učitavanje...</div>;
}
if (!session) {
  if (showRegister) {
    return (
      <RegisterCompany onBack={() => setShowRegister(false)} />
    );
  }

  return <Login onRegister={() => setShowRegister(true)} />;
}

if (profileLoading || (!profile && !profileError)) {
  return <div className="auth-loading">Učitavanje naloga...</div>;
}

if (profileError) {
  return (
    <div className="account-status-page">
      <div className="account-status-card">
        <span className="account-status-badge error">
          GREŠKA NALOGA
        </span>
        <h1>Nalog nije dostupan</h1>
        <p>{profileError}</p>
        <button type="button" onClick={handleAccountLogout}>
          Odjavi se
        </button>
      </div>
    </div>
  );
}

if (!profile.is_active) {
  return (
    <div className="account-status-page">
      <div className="account-status-card">
        <span className="account-status-badge pending">
          ČEKA ODOBRENJE
        </span>
        <h1>Registracija je primljena</h1>
        <p>
          Administrator platforme mora da odobri firmu pre
          nego što dobiješ pristup MOVIX-u.
        </p>
        <button type="button" onClick={handleAccountLogout}>
          Odjavi se
        </button>
      </div>
    </div>
  );
}
return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">
       <Header
  activePage={activePage}
  companyName={
    profile?.companies?.name ||
    profile?.companies?.[0]?.name ||
    ""
  }
  logoUrl={
  (profile?.companies?.logo_path ||
    profile?.companies?.[0]?.logo_path)
    ? supabase.storage
        .from("company-logos")
        .getPublicUrl(
          profile?.companies?.logo_path ||
            profile?.companies?.[0]?.logo_path
        ).data.publicUrl
    : ""
}
/>

        {activePage === "dashboard" && <Dashboard />}
        {activePage === "requests" && (
  <Requests companyId={profile.company_id} />
)}
        {activePage === "company" && (
  <CompanyProfile
    companyId={profile.company_id}
    userRole={profile.role}
  />
)}

        {activePage === "clients" && (
  <Clients companyId={profile.company_id} />
)}

      {activePage === "deliveries" && <Deliveries />}

        {activePage === "couriers" && (
  <Couriers companyId={profile.company_id} />
)}
      </main>
    </div>
  );
}

export default App;