import { useMemo, useState } from "react";
import "../../App.css";

function getTodayDate() {
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  );
  return localDate.toISOString().split("T")[0];
}

function Maintenance({
  onBack,
  equipment,
  maintenanceRecords,
  setMaintenanceRecords,
}) {
  const [operationType, setOperationType] = useState("Ремонт");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    equipmentId: "",
    date: getTodayDate(),
    description: "",
    cost: "",
  });

  const availableEquipment = equipment.filter(
    (item) => item.status !== "Списано" && item.quantity > 0
  );

  const nextMaintenanceDates = useMemo(() => {
    const dates = {};

    maintenanceRecords
      .filter(
        (record) => record.type === "Технічне обслуговування"
      )
      .forEach((record) => {
        if (
          !dates[record.equipmentId] ||
          record.date > dates[record.equipmentId]
        ) {
          dates[record.equipmentId] = record.date;
        }
      });

    return dates;
  }, [maintenanceRecords]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenForm = (type) => {
    setOperationType(type);

    setFormData({
      equipmentId: "",
      date: getTodayDate(),
      description: "",
      cost: "",
    });

    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);

    setFormData({
      equipmentId: "",
      date: getTodayDate(),
      description: "",
      cost: "",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const selectedEquipment = availableEquipment.find(
      (item) => item.id === Number(formData.equipmentId)
    );

    if (!selectedEquipment) {
      window.alert("Оберіть обладнання зі списку.");
      return;
    }

    const newRecord = {
      id: Date.now(),
      equipmentId: selectedEquipment.id,
      equipmentName: selectedEquipment.name,
      type:
        operationType === "Ремонт"
          ? "Ремонт"
          : "Технічне обслуговування",
      date: formData.date,
      description:
        operationType === "Ремонт"
          ? formData.description.trim()
          : "",
      cost: Number(formData.cost),
    };

    setMaintenanceRecords((prev) => [
      ...prev,
      newRecord,
    ]);

    handleCancel();
  };

  return (
    <main className="equipment-page">
      <div className="equipment-heading">
        <div>
          <span className="welcome-label">
            AURORARENT / ТЕХНІЧНИЙ СТАН
          </span>

          <h1>Обслуговування і ремонт</h1>

          <p>
            Контроль ремонтних робіт та технічного обслуговування обладнання
          </p>
        </div>

        <button className="back-button" onClick={onBack}>
          ← Назад
        </button>
      </div>

      <section className="equipment-panel">
        <div className="equipment-list-heading">
          <div>
            <h2>Список обладнання</h2>

            <p>
              Обладнання та терміни його технічного обслуговування
            </p>
          </div>
        </div>

        {availableEquipment.length > 0 ? (
          <div className="equipment-table-wrapper">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>Назва обладнання</th>
                  <th>Виробник</th>
                  <th>Кількість</th>
                  <th>Наступне ТО</th>
                </tr>
              </thead>

              <tbody>
                {availableEquipment.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.manufacturer}</td>
                    <td>{item.quantity}</td>
                    <td>
                      {nextMaintenanceDates[item.id]
                        ? new Date(
                            `${nextMaintenanceDates[item.id]}T00:00:00`
                          ).toLocaleDateString("uk-UA")
                        : "Не заплановано"}
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

        <div
          className="equipment-heading-actions"
          style={{ marginTop: "24px" }}
        >
          <button
            type="button"
            className="equipment-add-button"
            onClick={() => handleOpenForm("Ремонт")}
          >
            + Додати ремонтні роботи
          </button>

          <button
            type="button"
            className="equipment-add-button"
            onClick={() =>
              handleOpenForm("Технічне обслуговування")
            }
          >
            + Додати технічне обслуговування
          </button>
        </div>

        {showForm && (
          <form
            className="equipment-form"
            onSubmit={handleSubmit}
          >
            <div className="equipment-form-heading">
              <h2>
                {operationType === "Ремонт"
                  ? "Додавання ремонтних робіт"
                  : "Додавання технічного обслуговування"}
              </h2>

              <p>Заповніть дані та збережіть запис</p>
            </div>

            <div className="equipment-form-grid">
              <div className="equipment-field">
                <label htmlFor="maintenance-equipment">
                  Обладнання *
                </label>

                <select
                  id="maintenance-equipment"
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
                <label htmlFor="maintenance-date">
                  {operationType === "Ремонт"
                    ? "Термін виконання ремонту *"
                    : "Термін проведення ТО *"}
                </label>

                <input
                  id="maintenance-date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              {operationType === "Ремонт" && (
                <div className="equipment-field equipment-field-full">
                  <label htmlFor="maintenance-description">
                    Опис ремонту *
                  </label>

                  <textarea
                    id="maintenance-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Опишіть ремонтні роботи..."
                    rows="3"
                    required
                  />
                </div>
              )}

              <div className="equipment-field">
                <label htmlFor="maintenance-cost">
                  Вартість *
                </label>

                <input
                  id="maintenance-cost"
                  name="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost}
                  onChange={handleChange}
                  placeholder="Введіть вартість"
                  required
                />
              </div>
            </div>

            <div className="equipment-form-actions">
              <button type="button" onClick={handleCancel}>
                Скасувати
              </button>

              <button type="submit">
                Зберегти
              </button>
            </div>
          </form>
        )}

        <div
          className="equipment-list-heading"
          style={{ marginTop: "32px" }}
        >
          <div>
            <h2>Історія ремонтів та обслуговування</h2>
            <p>Збережені записи</p>
          </div>
        </div>

        {maintenanceRecords.length > 0 ? (
          <div className="equipment-table-wrapper">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>Обладнання</th>
                  <th>Операція</th>
                  <th>Термін</th>
                  <th>Опис ремонту</th>
                  <th>Вартість</th>
                </tr>
              </thead>

              <tbody>
                {[...maintenanceRecords]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((record) => (
                    <tr key={record.id}>
                      <td>{record.equipmentName}</td>
                      <td>{record.type}</td>
                      <td>
                        {new Date(
                          `${record.date}T00:00:00`
                        ).toLocaleDateString("uk-UA")}
                      </td>
                      <td>{record.description || "—"}</td>
                      <td>
                        {record.cost.toLocaleString("uk-UA")} грн
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="equipment-empty">
            Записів про ремонт або обслуговування поки немає.
          </div>
        )}
      </section>
    </main>
  );
}

export default Maintenance;