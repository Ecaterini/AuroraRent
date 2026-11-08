
import { useState } from "react";
import "../../App.css";

function getTodayDate() {
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().split("T")[0];
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(`${date}T00:00:00`).toLocaleDateString("uk-UA");
}

function RentalContracts({
  onBack,
  equipment,
  setEquipment,
  contracts,
  setContracts,
}) {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    clientName: "",
    clientPhone: "",
    department: "",
    equipmentId: "",
    startDate: getTodayDate(),
    endDate: "",
    price: "",
    deposit: "",
  });

  const availableEquipment = equipment.filter(
    (item) =>
      item.quantity > 0 &&
      (!item.status || item.status === "Доступно")
  );

  const selectedEquipment = availableEquipment.find(
    (item) => item.id === Number(formData.equipmentId)
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      clientName: "",
      clientPhone: "",
      department: "",
      equipmentId: "",
      startDate: getTodayDate(),
      endDate: "",
      price: "",
      deposit: "",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedEquipment) {
      window.alert("Оберіть доступне обладнання.");
      return;
    }

    if (formData.endDate < formData.startDate) {
      window.alert("Дата завершення не може бути раніше дати початку.");
      return;
    }

    const newContract = {
      id: Date.now(),
      number: `AR-${String(contracts.length + 1).padStart(4, "0")}`,
      clientName: formData.clientName.trim(),
      clientPhone: formData.clientPhone.trim(),
      department: formData.department.trim(),
      equipmentId: selectedEquipment.id,
      equipmentName: selectedEquipment.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      price: Number(formData.price),
      deposit: Number(formData.deposit || 0),
      status: "Активний",
    };

    setContracts((prev) => [...prev, newContract]);

    setEquipment((prev) =>
      prev.map((item) =>
        item.id === selectedEquipment.id
          ? { ...item, status: "Орендовано" }
          : item
      )
    );

    handleCancel();
  };

  return (
    <main className="equipment-page">
      <div className="equipment-heading">
        <div>
          <span className="welcome-label">
            AURORARENT / ДОГОВОРИ ОРЕНДИ
          </span>

          <h1>Договори оренди</h1>

          <p>Реєстрація та облік договорів оренди обладнання</p>
        </div>

        <button className="back-button" onClick={onBack}>
          ← Назад
        </button>
      </div>

      <section className="equipment-panel">
        <div className="equipment-list-heading">
          <div>
            <h2>Зареєстровані договори</h2>
            <p>Список оформлених договорів оренди</p>
          </div>

          <button
            type="button"
            className="equipment-add-button"
            onClick={() => setShowForm(true)}
          >
            + Створити договір
          </button>
        </div>

        {contracts.length > 0 ? (
          <div className="equipment-table-wrapper">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>№ договору</th>
                  <th>Клієнт</th>
                  <th>Підрозділ</th>
                  <th>Обладнання</th>
                  <th>Початок оренди</th>
                  <th>Завершення оренди</th>
                  <th>Вартість</th>
                  <th>Статус</th>
                </tr>
              </thead>

              <tbody>
                {[...contracts].reverse().map((contract) => (
                  <tr key={contract.id}>
                    <td>{contract.number}</td>
                    <td>
                      {contract.clientName}
                      <br />
                      {contract.clientPhone}
                    </td>
                    <td>{contract.department || "Не вказано"}</td>
                    <td>{contract.equipmentName}</td>
                    <td>{formatDate(contract.startDate)}</td>
                    <td>{formatDate(contract.endDate)}</td>
                    <td>{Number(contract.price || 0).toLocaleString("uk-UA")} грн</td>
                    <td>{contract.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="equipment-empty">
            Договорів оренди поки немає.
          </div>
        )}

        {showForm && (
          <form className="equipment-form" onSubmit={handleSubmit}>
            <div className="equipment-form-heading">
              <h2>Новий договір оренди</h2>
              <p>Заповніть дані клієнта та умови оренди</p>
            </div>

            <div className="equipment-form-grid">
              <div className="equipment-field">
                <label htmlFor="rental-client">ПІБ клієнта *</label>
                <input
                  id="rental-client"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Введіть ПІБ клієнта"
                  required
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="rental-phone">Телефон клієнта *</label>
                <input
                  id="rental-phone"
                  name="clientPhone"
                  type="tel"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  placeholder="+380..."
                  required
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="rental-department">
                  Підрозділ компанії *
                </label>
                <input
                  id="rental-department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Наприклад: Будівельний відділ"
                  required
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="rental-equipment">Обладнання *</label>
                <select
                  id="rental-equipment"
                  name="equipmentId"
                  value={formData.equipmentId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Оберіть обладнання</option>

                  {availableEquipment.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — {item.quantity} од.
                    </option>
                  ))}
                </select>
              </div>

              <div className="equipment-field">
                <label htmlFor="rental-start">Дата початку оренди *</label>
                <input
                  id="rental-start"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="rental-end">Дата завершення оренди *</label>
                <input
                  id="rental-end"
                  name="endDate"
                  type="date"
                  min={formData.startDate}
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="rental-price">Вартість оренди (грн) *</label>
                <input
                  id="rental-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Введіть вартість"
                  required
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="rental-deposit">Застава (грн)</label>
                <input
                  id="rental-deposit"
                  name="deposit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.deposit}
                  onChange={handleChange}
                  placeholder="За потреби"
                />
              </div>
            </div>

            <div className="equipment-form-actions">
              <button type="submit" className="equipment-add-button">
                Зберегти договір
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
      </section>
    </main>
  );
}

export default RentalContracts;
