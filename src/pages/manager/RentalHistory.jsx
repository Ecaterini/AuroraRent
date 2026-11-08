import { useState } from "react";
import "../../App.css";

function formatDate(date) {
  if (!date) return "—";
  return new Date(`${date}T00:00:00`).toLocaleDateString("uk-UA");
}

function RentalHistory({ onBack, equipment, contracts }) {
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("all");

  const filteredContracts = contracts
    .filter(
      (contract) =>
        selectedEquipmentId === "all" ||
        contract.equipmentId === Number(selectedEquipmentId)
    )
    .sort((a, b) => b.startDate.localeCompare(a.startDate));

  const selectedEquipment =
    equipment.find((item) => item.id === Number(selectedEquipmentId));

  const totalRentals = filteredContracts.length;

  const completedRentals = filteredContracts.filter(
    (contract) => contract.status === "Повернуто"
  ).length;

  const activeRentals = filteredContracts.filter(
    (contract) => contract.status !== "Повернуто"
  ).length;

  return (
    <main className="equipment-page">
      <div className="equipment-heading">
        <div>
          <span className="welcome-label">
            AURORARENT / ІСТОРІЯ ОРЕНДИ
          </span>

          <h1>Історія оренди</h1>

          <p>Перегляд історії оренди кожної одиниці обладнання</p>
        </div>

        <button className="back-button" onClick={onBack}>
          ← Назад
        </button>
      </div>

      <section className="equipment-panel">
        <div className="equipment-list-heading">
          <div>
            <h2>Історія оренди обладнання</h2>
            <p>Оберіть обладнання для перегляду його історії</p>
          </div>
        </div>

        <div className="equipment-field rental-history-select">
          <label htmlFor="history-equipment">
            Обладнання
          </label>

          <select
            id="history-equipment"
            value={selectedEquipmentId}
            onChange={(event) =>
              setSelectedEquipmentId(event.target.value)
            }
          >
            <option value="all">Усе обладнання</option>

            {equipment.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="rental-summary">
          <div className="rental-summary-card">
            <span>Усього договорів</span>
            <strong>{totalRentals}</strong>
          </div>

          <div className="rental-summary-card">
            <span>Активні оренди</span>
            <strong>{activeRentals}</strong>
          </div>

          <div className="rental-summary-card">
            <span>Завершені оренди</span>
            <strong>{completedRentals}</strong>
          </div>
        </div>

        {selectedEquipment && (
          <div className="rental-history-info">
            <h3>{selectedEquipment.name}</h3>
            <p>
              Виробник: {selectedEquipment.manufacturer || "—"}
            </p>
            <p>
              Поточна кількість: {selectedEquipment.quantity}
            </p>
          </div>
        )}

        {filteredContracts.length > 0 ? (
          <div className="equipment-table-wrapper">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>№ договору</th>
                  <th>Клієнт</th>
                  <th>Телефон</th>
                  <th>Обладнання</th>
                  <th>Початок оренди</th>
                  <th>Завершення оренди</th>
                  <th>Вартість</th>
                  <th>Статус</th>
                </tr>
              </thead>

              <tbody>
                {filteredContracts.map((contract) => (
                  <tr key={contract.id}>
                    <td>{contract.number}</td>
                    <td>{contract.clientName}</td>
                    <td>{contract.clientPhone || "—"}</td>
                    <td>{contract.equipmentName}</td>
                    <td>{formatDate(contract.startDate)}</td>
                    <td>{formatDate(contract.endDate)}</td>
                    <td>
                      {Number(contract.price).toLocaleString("uk-UA")} грн
                    </td>
                    <td>{contract.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="equipment-empty">
            {selectedEquipmentId === "all"
              ? "Історія оренди поки порожня. Зареєструйте перший договір."
              : "Для цього обладнання ще немає історії оренди."}
          </div>
        )}
      </section>
    </main>
  );
}

export default RentalHistory;