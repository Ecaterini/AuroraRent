import "../../App.css";

function getDaysRemaining(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(`${date}T00:00:00`);
  return Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(`${date}T00:00:00`).toLocaleDateString("uk-UA");
}

function RentalTerms({
  onBack,
  contracts,
  setContracts,
  equipment,
  setEquipment,
}) {
  const handleReturn = (contract) => {
    const confirmed = window.confirm(
      `Підтвердити повернення обладнання "${contract.equipmentName}"?`
    );

    if (!confirmed) return;

    setContracts((prev) =>
      prev.map((item) =>
        item.id === contract.id
          ? { ...item, status: "Повернуто" }
          : item
      )
    );

    setEquipment((prev) =>
      prev.map((item) =>
        item.id === contract.equipmentId
          ? { ...item, status: "Доступно" }
          : item
      )
    );
  };

  const getContractStatus = (contract) => {
    if (contract.status === "Повернуто") {
      return "Повернуто";
    }

    const days = getDaysRemaining(contract.endDate);

    if (days < 0) return "Прострочено";
    if (days <= 3) return "Термін спливає";

    return "Активний";
  };

  const activeContracts = contracts.filter(
    (contract) => contract.status !== "Повернуто"
  ).length;

  const overdueContracts = contracts.filter(
    (contract) => getContractStatus(contract) === "Прострочено"
  ).length;

  return (
    <main className="equipment-page">
      <div className="equipment-heading">
        <div>
          <span className="welcome-label">
            AURORARENT / СТРОКИ ОРЕНДИ
          </span>

          <h1>Строки оренди</h1>

          <p>Контроль термінів оренди та повернення обладнання</p>
        </div>

        <button className="back-button" onClick={onBack}>
          ← Назад
        </button>
      </div>

      <section className="equipment-panel">
        <div className="equipment-list-heading">
          <div>
            <h2>Контроль оренди</h2>
            <p>Перегляд строків дії договорів та повернення обладнання</p>
          </div>
        </div>

        <div className="rental-summary">
          <div className="rental-summary-card">
            <span>Усього договорів</span>
            <strong>{contracts.length}</strong>
          </div>

          <div className="rental-summary-card">
            <span>Активна оренда</span>
            <strong>{activeContracts}</strong>
          </div>

          <div className="rental-summary-card">
            <span>Прострочені договори</span>
            <strong>{overdueContracts}</strong>
          </div>
        </div>

        {contracts.length > 0 ? (
          <div className="equipment-table-wrapper">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>№ договору</th>
                  <th>Клієнт</th>
                  <th>Обладнання</th>
                  <th>Початок оренди</th>
                  <th>Повернення до</th>
                  <th>Залишилось днів</th>
                  <th>Статус</th>
                  <th>Дія</th>
                </tr>
              </thead>

              <tbody>
                {[...contracts]
                  .sort((a, b) => a.endDate.localeCompare(b.endDate))
                  .map((contract) => {
                    const status = getContractStatus(contract);
                    const days = getDaysRemaining(contract.endDate);

                    return (
                      <tr key={contract.id}>
                        <td>{contract.number}</td>
                        <td>{contract.clientName}</td>
                        <td>{contract.equipmentName}</td>
                        <td>{formatDate(contract.startDate)}</td>
                        <td>{formatDate(contract.endDate)}</td>
                        <td>
                          {status === "Повернуто"
                            ? "—"
                            : days < 0
                              ? `Прострочено на ${Math.abs(days)} дн.`
                              : `${days} дн.`}
                        </td>
                        <td>{status}</td>
                        <td>
                          {status !== "Повернуто" ? (
                            <button
                              type="button"
                              className="directory-edit-button"
                              onClick={() => handleReturn(contract)}
                            >
                              Підтвердити повернення
                            </button>
                          ) : (
                            <span>Завершено</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="equipment-empty">
            Договорів оренди поки немає. Спочатку зареєструйте договір у розділі «Договори оренди».
          </div>
        )}
      </section>
    </main>
  );
}

export default RentalTerms;