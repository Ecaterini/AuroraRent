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

function Movement({
  onBack,
  equipment,
  setEquipment,
  directories,
  movementRecords,
  setMovementRecords,
}) {
  const departments = directories["Підрозділ"] || [];

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    equipmentId: "",
    newDepartment: "",
    date: getTodayDate(),
    reason: "",
  });

  const availableEquipment = equipment.filter(
    (item) => item.status !== "Списано" && item.quantity > 0
  );

  const selectedEquipment = availableEquipment.find(
    (item) => item.id === Number(formData.equipmentId)
  );

  const currentDepartment = selectedEquipment
    ? selectedEquipment.department || departments[0] || "Не визначено"
    : "";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenForm = () => {
    setFormData({
      equipmentId: "",
      newDepartment: "",
      date: getTodayDate(),
      reason: "",
    });

    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);

    setFormData({
      equipmentId: "",
      newDepartment: "",
      date: getTodayDate(),
      reason: "",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedEquipment) {
      window.alert("Оберіть обладнання.");
      return;
    }

    if (!formData.newDepartment) {
      window.alert("Оберіть новий підрозділ.");
      return;
    }

    if (formData.newDepartment === currentDepartment) {
      window.alert("Оберіть інший підрозділ для переміщення.");
      return;
    }

    if (!formData.date) {
      window.alert("Вкажіть дату переміщення.");
      return;
    }

    const newRecord = {
      id: Date.now(),
      equipmentId: selectedEquipment.id,
      equipmentName: selectedEquipment.name,
      fromDepartment: currentDepartment,
      toDepartment: formData.newDepartment,
      date: formData.date,
      reason: formData.reason.trim(),
      quantity: selectedEquipment.quantity,
    };

    setEquipment((prev) =>
      prev.map((item) =>
        item.id === selectedEquipment.id
          ? {
              ...item,
              department: formData.newDepartment,
            }
          : item
      )
    );

    setMovementRecords((prev) => [...prev, newRecord]);

    handleCancel();
  };

  return (
    <main className="equipment-page">
      <div className="equipment-heading">
        <div>
          <span className="welcome-label">
            AURORARENT / ПЕРЕМІЩЕННЯ
          </span>

          <h1>Переміщення обладнання</h1>

          <p>Облік переміщення обладнання між підрозділами</p>
        </div>

        <button className="back-button" onClick={onBack}>
          ← Назад
        </button>
      </div>

      <section className="equipment-panel">
        <div className="equipment-list-heading">
          <div>
            <h2>Список обладнання</h2>
            <p>Поточне розташування обладнання за підрозділами</p>
          </div>

          <button
            type="button"
            className="equipment-add-button"
            onClick={handleOpenForm}
          >
            + Зареєструвати переміщення
          </button>
        </div>

        {availableEquipment.length > 0 ? (
          <div className="equipment-table-wrapper">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>Назва обладнання</th>
                  <th>Виробник</th>
                  <th>Кількість</th>
                  <th>Поточний підрозділ</th>
                </tr>
              </thead>

              <tbody>
                {availableEquipment.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.manufacturer}</td>
                    <td>{item.quantity}</td>
                    <td>
                      {item.department || departments[0] || "Не визначено"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="equipment-empty">
            Немає доступного обладнання.
          </div>
        )}

        {showForm && (
          <form className="equipment-form" onSubmit={handleSubmit}>
            <div className="equipment-form-heading">
              <h2>Нове переміщення</h2>
              <p>Заповніть інформацію про переміщення обладнання</p>
            </div>

            <div className="equipment-form-grid">
              <div className="equipment-field">
                <label htmlFor="movement-equipment">
                  Обладнання *
                </label>

                <select
                  id="movement-equipment"
                  name="equipmentId"
                  value={formData.equipmentId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Оберіть обладнання</option>

                  {availableEquipment.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="equipment-field">
                <label>Поточний підрозділ</label>

                <input
                  value={currentDepartment}
                  placeholder="Оберіть обладнання"
                  readOnly
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="movement-department">
                  Новий підрозділ *
                </label>

                <select
                  id="movement-department"
                  name="newDepartment"
                  value={formData.newDepartment}
                  onChange={handleChange}
                  required
                >
                  <option value="">Оберіть підрозділ</option>

                  {departments.map((department, index) => (
                    <option key={`${department}-${index}`} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="equipment-field">
                <label htmlFor="movement-date">
                  Дата переміщення *
                </label>

                <input
                  id="movement-date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="movement-reason">
                  Причина переміщення
                </label>

                <input
                  id="movement-reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Вкажіть причину (необов'язково)"
                />
              </div>
            </div>

            <div className="equipment-form-actions">
              <button type="submit" className="equipment-add-button">
                Зберегти переміщення
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

      <section className="equipment-panel" style={{ marginTop: "24px" }}>
        <div className="equipment-list-heading">
          <div>
            <h2>Історія переміщень</h2>
            <p>Збережені записи про переміщення обладнання</p>
          </div>
        </div>

        {movementRecords.length > 0 ? (
          <div className="equipment-table-wrapper">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>Обладнання</th>
                  <th>Звідки</th>
                  <th>Куди</th>
                  <th>Дата</th>
                  <th>Кількість</th>
                  <th>Причина</th>
                </tr>
              </thead>

              <tbody>
                {[...movementRecords].reverse().map((record) => (
                  <tr key={record.id}>
                    <td>{record.equipmentName}</td>
                    <td>{record.fromDepartment}</td>
                    <td>{record.toDepartment}</td>
                    <td>{formatDate(record.date)}</td>
                    <td>{record.quantity}</td>
                    <td>{record.reason || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="equipment-empty">
            Переміщень поки немає.
          </div>
        )}
      </section>
    </main>
  );
}

export default Movement;