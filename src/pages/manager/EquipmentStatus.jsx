import "../../App.css";

const equipmentStatuses = [
  "Доступно",
  "Орендовано",
  "Заброньовано",
  "На обслуговуванні",
  "Списано",
];

function getTodayDate() {
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().split("T")[0];
}

function EquipmentStatus({ onBack, equipment, setEquipment }) {
  const handleStatusChange = (id, status) => {
    setEquipment((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if ((item.status || "Доступно") === status) {
          return item;
        }

        return {
          ...item,
          status,
          statusChangedAt: getTodayDate(),
        };
      })
    );
  };

  return (
    <main className="equipment-page">
      <div className="equipment-heading">
        <div>
          <span className="welcome-label">
            AURORARENT / СТАН ОБЛАДНАННЯ
          </span>

          <h1>Стан обладнання</h1>

          <p>Відстеження поточного стану та доступності обладнання</p>
        </div>

        <button className="back-button" onClick={onBack}>
          ← Назад
        </button>
      </div>

      <section className="equipment-panel">
        <div className="equipment-list-heading">
          <div>
            <h2>Список обладнання</h2>
            <p>Перегляд та зміна поточного стану обладнання</p>
          </div>

          <span className="equipment-count">
            Усього: {equipment.length}
          </span>
        </div>

        {equipment.length > 0 ? (
          <div className="equipment-table-wrapper">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>Назва обладнання</th>
                  <th>Виробник</th>
                  <th>Кількість</th>
                  <th>Поточний стан</th>
                  <th>Змінити стан</th>
                </tr>
              </thead>

              <tbody>
                {equipment.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.manufacturer}</td>
                    <td>{item.quantity}</td>
                    <td>{item.status || "Доступно"}</td>
                    <td>
                      <select
                        value={item.status || "Доступно"}
                        onChange={(event) =>
                          handleStatusChange(item.id, event.target.value)
                        }
                        disabled={item.quantity <= 0}
                      >
                        {equipmentStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="equipment-empty">
            У системі поки немає зареєстрованого обладнання.
          </div>
        )}
      </section>
    </main>
  );
}

export default EquipmentStatus;