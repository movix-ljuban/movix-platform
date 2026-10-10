import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const emptyCompany = {
  name: "",
  legal_name: "",
  tax_id: "",
  registration_number: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  website: "",
  description: "",
};

const companyFields = [
  {
    key: "name",
    label: "Naziv firme",
    type: "text",
  },
  {
    key: "legal_name",
    label: "Pun pravni naziv",
    type: "text",
  },
  {
    key: "tax_id",
    label: "PIB",
    type: "text",
  },
  {
    key: "registration_number",
    label: "Matični broj",
    type: "text",
  },
  {
    key: "phone",
    label: "Telefon",
    type: "tel",
  },
  {
    key: "email",
    label: "Email firme",
    type: "email",
  },
  {
    key: "address",
    label: "Adresa",
    type: "text",
  },
  {
    key: "city",
    label: "Grad",
    type: "text",
  },
  {
    key: "website",
    label: "Web-sajt",
    type: "text",
  },
];

function CompanyProfile({ companyId, userRole }) {
  const [company, setCompany] = useState(null);
  const [companyForm, setCompanyForm] =
    useState(emptyCompany);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingLogo, setUploadingLogo] =
    useState(false);

  const canEdit = userRole === "owner";

  useEffect(() => {
    if (companyId) {
      loadCompany();
    }
  }, [companyId]);

  const fillCompanyForm = (data) => {
    setCompanyForm({
      name: data.name || "",
      legal_name: data.legal_name || "",
      tax_id: data.tax_id || "",
      registration_number:
        data.registration_number || "",
      phone: data.phone || "",
      email: data.email || "",
      address: data.address || "",
      city: data.city || "",
      website: data.website || "",
      description: data.description || "",
    });
  };

  const loadCompany = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", companyId)
      .single();

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setCompany(data);
    fillCompanyForm(data);
    setLoading(false);
  };

  const cancelEditing = () => {
    fillCompanyForm(company);
    setEditing(false);
  };

  const saveCompany = async () => {
    const cleanName = companyForm.name.trim();

    if (!cleanName) {
      alert("Naziv firme je obavezan.");
      return;
    }

    const { error } = await supabase
      .from("companies")
      .update({
        name: cleanName,
        legal_name:
          companyForm.legal_name.trim() || null,
        tax_id: companyForm.tax_id.trim() || null,
        registration_number:
          companyForm.registration_number.trim() ||
          null,
        phone: companyForm.phone.trim() || null,
        email: companyForm.email.trim() || null,
        address: companyForm.address.trim() || null,
        city: companyForm.city.trim() || null,
        website: companyForm.website.trim() || null,
        description:
          companyForm.description.trim() || null,
      })
      .eq("id", companyId);

    if (error) {
      alert(error.message);
      return;
    }

    setEditing(false);
    loadCompany();
  };

  const uploadLogo = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Logo mora biti PNG, JPG ili WEBP slika.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Logo ne sme biti veći od 2 MB.");
      event.target.value = "";
      return;
    }

    const extension =
      file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : "jpg";

    const filePath =
      `${companyId}/logo-${Date.now()}.${extension}`;

    setUploadingLogo(true);

    const { error: uploadError } =
      await supabase.storage
        .from("company-logos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

    if (uploadError) {
      alert(uploadError.message);
      setUploadingLogo(false);
      event.target.value = "";
      return;
    }

    const oldLogoPath = company.logo_path;

    const { error: updateError } = await supabase
      .from("companies")
      .update({
        logo_path: filePath,
      })
      .eq("id", companyId);

    if (updateError) {
      await supabase.storage
        .from("company-logos")
        .remove([filePath]);

      alert(updateError.message);
      setUploadingLogo(false);
      event.target.value = "";
      return;
    }

    if (oldLogoPath) {
      await supabase.storage
        .from("company-logos")
        .remove([oldLogoPath]);
    }

    setUploadingLogo(false);
    event.target.value = "";
    loadCompany();
  };

  if (loading) {
    return (
      <section className="company-profile">
        <p className="empty-message">
          Učitavanje podataka firme...
        </p>
      </section>
    );
  }

  if (!company) {
    return (
      <section className="company-profile">
        <p className="empty-message">
          Podaci firme nisu pronađeni.
        </p>
      </section>
    );
  }

  const logoUrl = company.logo_path
    ? supabase.storage
        .from("company-logos")
        .getPublicUrl(company.logo_path)
        .data.publicUrl
    : null;

  const companyDetails = [
    ["PIB", company.tax_id],
    ["Matični broj", company.registration_number],
    ["Telefon", company.phone],
    ["Email", company.email],
    ["Adresa", company.address],
    ["Grad", company.city],
    ["Web-sajt", company.website],
    ["Identifikator firme", company.slug],
  ];

  return (
    <section className="company-profile">
      <div className="section-header">
        <div>
          <h2>Firma</h2>
          <p>Podaci, kontakt i status vaše firme.</p>
        </div>

        {canEdit && !editing && (
          <button
            className="primary-button"
            onClick={() => setEditing(true)}
          >
            Izmeni podatke
          </button>
        )}
      </div>

      {editing ? (
        <div className="table-card company-form">
          <h3>Izmeni podatke firme</h3>

          {companyFields.map((field) => (
            <label key={field.key}>
              {field.label}

              <input
                type={field.type}
                value={companyForm[field.key]}
                onChange={(event) =>
                  setCompanyForm({
                    ...companyForm,
                    [field.key]: event.target.value,
                  })
                }
              />
            </label>
          ))}

          <label className="company-description-field">
            Opis firme

            <textarea
              rows="4"
              value={companyForm.description}
              onChange={(event) =>
                setCompanyForm({
                  ...companyForm,
                  description: event.target.value,
                })
              }
            />
          </label>

          <div className="company-form-actions">
            <button
              className="primary-button"
              onClick={saveCompany}
            >
              Sačuvaj izmene
            </button>

            <button
              className="small-button"
              onClick={cancelEditing}
            >
              Otkaži
            </button>
          </div>
        </div>
      ) : (
        <div className="company-profile-card">
          <div className="company-profile-top">
            <div className="company-logo-column">
              <div className="company-logo-large">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={`Logo firme ${company.name}`}
                  />
                ) : (
                  company.name
                    .trim()
                    .slice(0, 4)
                    .toUpperCase()
                )}
              </div>

              {canEdit && (
                <label className="logo-upload-button">
                  {uploadingLogo
                    ? "Postavljanje..."
                    : logoUrl
                      ? "Promeni logo"
                      : "Postavi logo"}

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    disabled={uploadingLogo}
                    onChange={uploadLogo}
                  />
                </label>
              )}
            </div>

            <div>
              <h3>{company.name}</h3>

              <p>
                {company.legal_name ||
                  "Pravni naziv nije unet"}
              </p>

              <span
                className={
                  company.is_active
                    ? "company-status active"
                    : "company-status inactive"
                }
              >
                {company.is_active
                  ? "Aktivna firma"
                  : "Neaktivna firma"}
              </span>
            </div>
          </div>

          {company.description && (
            <p className="company-description">
              {company.description}
            </p>
          )}

          <div className="company-details-grid">
            {companyDetails.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value || "—"}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default CompanyProfile;