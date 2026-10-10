import { useState } from "react";
import { supabase } from "../lib/supabase";

function RegisterCompany({ onBack }) {
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (password.length < 8) {
      setErrorMessage("Lozinka mora imati najmanje 8 znakova.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Lozinke se ne podudaraju.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          registration_type: "company_owner",
          company_name: companyName.trim(),
          full_name: fullName.trim(),
        },
      },
    });

    if (error) {
      console.error(error);
      setErrorMessage(
        "Registracija nije uspela. Proveri podatke i pokušaj ponovo."
      );
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="register-page">
        <div className="register-card register-success">
          <span className="register-badge">ZAHTEV POSLAT</span>
          <h1>Proveri svoj email</h1>
          <p>
            Nakon potvrde email adrese, registracija firme čeka
            odobrenje administratora MOVIX platforme.
          </p>
          <button type="button" onClick={onBack}>
            Vrati se na prijavu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-heading">
          <span className="register-eyebrow">MOVIX PLATFORMА</span>
          <h1>Registracija firme</h1>
          <p>
            Kreiraj nalog vlasnika i pošalji firmu na odobrenje.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="company-name">Naziv firme</label>
          <input
            id="company-name"
            type="text"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            autoComplete="organization"
            required
          />

          <label htmlFor="owner-name">Ime i prezime vlasnika</label>
          <input
            id="owner-name"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            autoComplete="name"
            required
          />

          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <div className="register-password-grid">
            <div>
              <label htmlFor="register-password">Lozinka</label>
              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label htmlFor="confirm-password">
                Ponovi lozinku
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          {errorMessage && (
            <p className="register-error">{errorMessage}</p>
          )}

          <button
            className="register-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Slanje zahteva..." : "Pošalji zahtev"}
          </button>
        </form>

        <button
          className="register-back"
          type="button"
          onClick={onBack}
        >
          Već imaš nalog? Prijavi se
        </button>
      </div>
    </div>
  );
}

export default RegisterCompany;