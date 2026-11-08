import { useState } from "react";
import "../../App.css";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  note: "",
};

function Clients({ onBack, clients, setClients }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenForm = (client = null) => {
    if (client) {
      setEditingId(client.id);
      setFormData({
        name: client.name,
        phone: client.phone,
        email: client.email || "",
        address: client.address || "",
        note: client.note || "",
      });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }

    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedPhone = formData.phone.replace(/\s/g, "");

    const phoneExists = clients.some(
      (client) =>
        client.phone.replace(/\s/g, "") === normalizedPhone &&
        client.id !== editingId
    );

    if (phoneExists) {
      window.alert("Клієнт із таким номером телефону вже зареєстрований.");
      return;
    }

    const clientData = {
      id: editingId ?? Date.now(),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      note: formData.note.trim(),
    };

    if (editingId !== null) {
      setClients((prev) =>
        prev.map((client) =>
          client.id === editingId ? clientData : client
        )
      );
    } else {
      setClients((prev) => [...prev, clientData]);
    }

    handleCancel();
  };

  const handleDelete = (client) => {
    const confirmed = window.confirm(
      `Видалити клієнта "${client.name}"?`
    );

    if (!confirmed) return;

    setClients((prev) =>
      prev.filter((item) => item.id !== client.id)
    );
  };

  return (
    <main className="equipment-page">
      <div className="equipment-heading">
        <div>
          <span className="welcome-label">
            AURORARENT / КЛІЄНТИ
          </span>

          <h1>Інформація про клієнтів</h1>

          <p>Реєстрація та управління даними клієнтів</p>
        </div>

        <button className="back-button" onClick={onBack}>
          ← Назад
        </button>
      </div>

      <section className="equipment-panel">
        <div className="equipment-list-heading">
          <div>
            <h2>Список клієнтів</h2>
            <p>Зареєстровані клієнти системи</p>
          </div>

          <div className="equipment-heading-actions">
            <span className="equipment-count">
              Усього: {clients.length}
            </span>

            <button
              type="button"
              className="equipment-add-button"
              onClick={() => handleOpenForm()}
            >
              + Додати клієнта
            </button>
          </div>
        </div>

        {showForm && (
          <form className="equipment-form" onSubmit={handleSubmit}>
            <div className="equipment-form-heading">
              <h2>
                {editingId !== null
                  ? "Редагування клієнта"
                  : "Новий клієнт"}
              </h2>

              <p>Заповніть контактну інформацію клієнта</p>
            </div>

            <div className="equipment-form-grid">
              <div className="equipment-field">
                <label htmlFor="client-name">ПІБ клієнта *</label>
                <input
                  id="client-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Введіть ім'я та прізвище"
                  required
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="client-phone">Телефон *</label>
                <input
                  id="client-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+380..."
                  required
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="client-email">Email</label>
                <input
                  id="client-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="client-address">Адреса</label>
                <input
                  id="client-address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Введіть адресу"
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="client-note">Примітка</label>
                <input
                  id="client-note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Додаткова інформація"
                />
              </div>
            </div>

            <div className="equipment-form-actions">
              <button type="submit" className="equipment-add-button">
                {editingId !== null ? "Зберегти зміни" : "Зареєструвати клієнта"}
              </button>

              <button
                type="button"
                className="directory-cancel-button"
                onClick={handleCancel}
              >
                Скасувати
              </button>
            </div>
          </form>
        )}

        {clients.length > 0 ? (
          <div className="equipment-table-wrapper">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>ПІБ клієнта</th>
                  <th>Телефон</th>
                  <th>Email</th>
                  <th>Адреса</th>
                  <th>Примітка</th>
                  <th>Дії</th>
                </tr>
              </thead>

              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.name}</td>
                    <td>{client.phone}</td>
                    <td>{client.email || "—"}</td>
                    <td>{client.address || "—"}</td>
                    <td>{client.note || "—"}</td>
                    <td>
                      <div className="directory-item-actions">
                        <button
                          type="button"
                          className="directory-edit-button"
                          onClick={() => handleOpenForm(client)}
                        >
                          Редагувати
                        </button>

                        <button
                          type="button"
                          className="directory-delete-button"
                          onClick={() => handleDelete(client)}
                        >
                          Видалити
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="equipment-empty">
            Клієнтів поки немає. Додайте першого клієнта.
          </div>
        )}
      </section>
    </main>
  );
}

export default Clients;