import { useState } from "react";
import "../../App.css";
import RentalHistory from "../manager/RentalHistory";

const sections = [
  {
    icon: "▣",
    title: "Надання інформації про потреби в обладнанні",
    description: "Перегляд інформації про потреби підрозділів",
    color: "lavender",
    details:
      "Інформація про потреби підрозділів в обладнанні, його типи та необхідну кількість.",
  },
  {
    icon: "▤",
    title: "Формування статистичних даних",
    description: "Загальна статистика використання обладнання",
    color: "blue",
    details:
      "Статистична інформація про кількість обладнання, його використання та оренду.",
  },
  {
    icon: "◉",
    title: "Аналіз статистичних даних потреби обладнання",
    description: "Аналіз потреб та використання обладнання",
    color: "mint",
    details:
      "Порівняння потреб підрозділів із наявною кількістю обладнання та аналіз його завантаженості.",
  },
  {
    icon: "↗",
    title: "Прогнозування потреби в закупівлі обладнання",
    description: "Оцінка майбутньої потреби в закупівлях",
    color: "peach",
    details:
      "Орієнтовний прогноз необхідності закупівлі обладнання на основі поточної наявності та потреб.",
  },
  {
    icon: "▥",
    title: "Формування аналітичних звітів",
    description: "Перегляд зведеної аналітичної інформації",
    color: "blue",
    details:
      "Аналітичні звіти щодо обладнання, його використання, оренди та потреб у закупівлях.",
  },
  {
    icon: "◷",
    title: "Перегляд ключових показників",
    description: "Основні показники роботи системи",
    color: "lavender",
    details:
      "Основні показники: загальна кількість обладнання, доступність, кількість договорів та активних оренд.",
  },
  {
    icon: "✧",
    title: "Формування рекомендацій",
    description: "Рекомендації щодо управління обладнанням",
    color: "mint",
    details:
      "Рекомендації щодо закупівлі, розподілу та ефективного використання обладнання.",
  },
  {
    icon: "▧",
    title: "Історія оренди обладнання",
    description: "Перегляд історії оренди кожної одиниці обладнання",
    color: "peach",
    history: true,
  },
];

function getTodayDate() {
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().split("T")[0];
}

function getFirstDayOfMonth() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}-01`;
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("uk-UA");
}

function getDaysBetween(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  return Math.floor((end - start) / (1000 * 60 * 60 * 24));
}

function getInclusiveDays(startDate, endDate) {
  return Math.max(0, getDaysBetween(startDate, endDate) + 1);
}

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} грн`;
}

function getMonthLabel(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("uk-UA", {
    month: "long",
    year: "numeric",
  });
}

function LeaderDashboard({
  onLogout,
  equipment,
  maintenanceRecords,
  contracts,
}) {
  const [selectedSection, setSelectedSection] = useState(null);

  const [dateFrom, setDateFrom] = useState(getFirstDayOfMonth());
  const [dateTo, setDateTo] = useState(getTodayDate());
  const [compareDateFrom, setCompareDateFrom] = useState(
    `${new Date().getFullYear()}-01-01`
  );
  const [compareDateTo, setCompareDateTo] = useState(getTodayDate());

  const today = getTodayDate();
  const nextWeek = new Date(`${today}T00:00:00`);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const nextWeekDate = [
    nextWeek.getFullYear(),
    String(nextWeek.getMonth() + 1).padStart(2, "0"),
    String(nextWeek.getDate()).padStart(2, "0"),
  ].join("-");

  const criticalEquipment = equipment.filter(
    (item) =>
      item.quantity <= 1 &&
      item.quantity >= 0 &&
      item.status !== "Списано"
  );

  const upcomingMaintenance = maintenanceRecords.filter(
    (record) =>
      record.type === "Технічне обслуговування" &&
      record.date >= today &&
      record.date <= nextWeekDate
  );

  const idleEquipment = equipment.filter((item) => {
    if (item.status !== "Доступно" || !item.statusChangedAt) {
      return false;
    }

    return getDaysBetween(item.statusChangedAt, today) >= 30;
  });

  const validPeriod = dateFrom && dateTo && dateFrom <= dateTo;

  const periodEquipment = validPeriod
    ? equipment.filter(
        (item) =>
          item.purchaseDate &&
          item.purchaseDate >= dateFrom &&
          item.purchaseDate <= dateTo
      )
    : [];

  const periodContracts = validPeriod
    ? contracts.filter(
        (contract) =>
          contract.startDate &&
          contract.startDate >= dateFrom &&
          contract.startDate <= dateTo
      )
    : [];

  const totalPurchaseCost = periodEquipment.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const totalRentalCost = periodContracts.reduce(
    (total, contract) => total + Number(contract.price || 0),
    0
  );

  const equipmentNotRented = equipment.reduce((total, item) => {
    if (item.status === "Орендовано" || item.status === "Списано") {
      return total;
    }

    return total + Number(item.quantity || 0);
  }, 0);

  const ordersByType = periodContracts.reduce((result, contract) => {
    const rentedEquipment = equipment.find(
      (item) => item.id === contract.equipmentId
    );

    const type = rentedEquipment?.type || "Не визначено";

    result[type] = (result[type] || 0) + 1;

    return result;
  }, {});

  // Analysis data for the selected period.
  const periodDays = validPeriod
    ? getInclusiveDays(dateFrom, dateTo)
    : 0;

  const overlappingContracts = validPeriod
    ? contracts.filter(
        (contract) =>
          contract.startDate &&
          contract.endDate &&
          contract.startDate <= dateTo &&
          contract.endDate >= dateFrom
      )
    : [];

  const getContractDays = (contract) => {
    const start =
      contract.startDate < dateFrom ? dateFrom : contract.startDate;

    const end =
      contract.endDate > dateTo ? dateTo : contract.endDate;

    return getInclusiveDays(start, end);
  };

  const rentedDaysByEquipment = overlappingContracts.reduce(
    (result, contract) => {
      const days = getContractDays(contract);
      result[contract.equipmentId] =
        (result[contract.equipmentId] || 0) + days;

      return result;
    },
    {}
  );

  const totalEquipmentQuantity = equipment.reduce(
    (total, item) =>
      item.status === "Списано"
        ? total
        : total + Number(item.quantity || 0),
    0
  );

  const totalAvailableDays = totalEquipmentQuantity * periodDays;

  const totalRentedDays = equipment.reduce((total, item) => {
    if (item.status === "Списано") return total;

    const rentedDays = Math.min(
      periodDays,
      rentedDaysByEquipment[item.id] || 0
    );

    return total + rentedDays * Number(item.quantity || 0);
  }, 0);

  const overallUtilization =
    totalAvailableDays > 0
      ? Math.min(100, (totalRentedDays / totalAvailableDays) * 100)
      : 0;

  const equipmentUtilization = equipment
    .filter((item) => item.status !== "Списано")
    .map((item) => {
      const rentedDays = Math.min(
        periodDays,
        rentedDaysByEquipment[item.id] || 0
      );

      const utilization =
        periodDays > 0 ? (rentedDays / periodDays) * 100 : 0;

      return {
        ...item,
        rentedDays,
        utilization,
      };
    })
    .sort((a, b) => a.utilization - b.utilization);

  const lowUtilizationEquipment = equipmentUtilization.filter(
    (item) => item.utilization < 20
  );

  const utilizationByType = equipmentUtilization.reduce(
    (result, item) => {
      const type = item.type || "Не визначено";

      if (!result[type]) {
        result[type] = {
          type,
          count: 0,
          rentedDays: 0,
          totalDays: 0,
          contracts: 0,
        };
      }

      result[type].count += Number(item.quantity || 0);
      result[type].rentedDays +=
        item.rentedDays * Number(item.quantity || 0);
      result[type].totalDays +=
        periodDays * Number(item.quantity || 0);

      return result;
    },
    {}
  );

  const categoryStatistics = Object.values(utilizationByType)
    .map((item) => ({
      ...item,
      utilization:
        item.totalDays > 0
          ? (item.rentedDays / item.totalDays) * 100
          : 0,
      contractCount: overlappingContracts.filter((contract) => {
        const rentedItem = equipment.find(
          (equipmentItem) => equipmentItem.id === contract.equipmentId
        );

        return (rentedItem?.type || "Не визначено") === item.type;
      }).length,
    }))
    .sort((a, b) => b.contractCount - a.contractCount);

  const monthlyStatistics = {};

  overlappingContracts.forEach((contract) => {
    const contractStart =
      contract.startDate < dateFrom ? dateFrom : contract.startDate;

    const contractEnd =
      contract.endDate > dateTo ? dateTo : contract.endDate;

    let current = new Date(`${contractStart}T00:00:00`);
    const end = new Date(`${contractEnd}T00:00:00`);

    while (current <= end) {
      const monthKey = [
        current.getFullYear(),
        String(current.getMonth() + 1).padStart(2, "0"),
      ].join("-");

      if (!monthlyStatistics[monthKey]) {
        monthlyStatistics[monthKey] = {
          month: monthKey,
          contracts: 0,
          rentalDays: 0,
        };
      }

      monthlyStatistics[monthKey].rentalDays += 1;

      current.setDate(current.getDate() + 1);
    }
  });

  overlappingContracts.forEach((contract) => {
    const monthKey = contract.startDate.slice(0, 7);

    if (monthlyStatistics[monthKey]) {
      monthlyStatistics[monthKey].contracts += 1;
    }
  });

  const monthlyRows = Object.values(monthlyStatistics).sort(
    (a, b) => a.month.localeCompare(b.month)
  );

  const departmentStatistics = overlappingContracts.reduce(
    (result, contract) => {
      const department = contract.department?.trim() || "Не вказано";

      if (!result[department]) {
        result[department] = {
          department,
          contracts: 0,
          rentalDays: 0,
        };
      }

      result[department].contracts += 1;
      result[department].rentalDays += getContractDays(contract);

      return result;
    },
    {}
  );

  const departmentRows = Object.values(departmentStatistics).sort(
    (a, b) => b.contracts - a.contracts
  );

  // Analytical reports data.
  const reportContracts = validPeriod
    ? contracts.filter(
        (contract) =>
          contract.startDate >= dateFrom &&
          contract.startDate <= dateTo
      )
    : [];

  const demandStatistics = reportContracts.reduce((result, contract) => {
    const item = equipment.find(
      (equipmentItem) => equipmentItem.id === contract.equipmentId
    );
    const name = item?.name || contract.equipmentName || "Не визначено";

    if (!result[name]) {
      result[name] = {
        name,
        type: item?.type || "Не визначено",
        contracts: 0,
        revenue: 0,
      };
    }

    result[name].contracts += 1;
    result[name].revenue += Number(contract.price || 0);
    return result;
  }, {});

  const demandRows = Object.values(demandStatistics).sort(
    (a, b) => b.contracts - a.contracts
  );

  const profitabilityStatistics = reportContracts.reduce(
    (result, contract) => {
      const item = equipment.find(
        (equipmentItem) => equipmentItem.id === contract.equipmentId
      );
      const type = item?.type || "Не визначено";

      if (!result[type]) {
        result[type] = {
          type,
          contracts: 0,
          revenue: 0,
          maintenanceCost: 0,
        };
      }

      result[type].contracts += 1;
      result[type].revenue += Number(contract.price || 0);
      return result;
    },
    {}
  );

  maintenanceRecords
    .filter(
      (record) => record.date >= dateFrom && record.date <= dateTo
    )
    .forEach((record) => {
      const item = equipment.find(
        (equipmentItem) => equipmentItem.id === record.equipmentId
      );
      const type = item?.type || "Не визначено";

      if (!profitabilityStatistics[type]) {
        profitabilityStatistics[type] = {
          type,
          contracts: 0,
          revenue: 0,
          maintenanceCost: 0,
        };
      }

      profitabilityStatistics[type].maintenanceCost += Number(
        record.cost || 0
      );
    });

  const profitabilityRows = Object.values(
    profitabilityStatistics
  ).map((item) => ({
    ...item,
    balance: item.revenue - item.maintenanceCost,
  }));

  const getPeriodReport = (from, to) => {
    const selectedContracts = contracts.filter(
      (contract) =>
        contract.startDate >= from && contract.startDate <= to
    );

    return {
      contracts: selectedContracts.length,
      revenue: selectedContracts.reduce(
        (total, contract) => total + Number(contract.price || 0),
        0
      ),
    };
  };

  const firstPeriodReport = validPeriod
    ? getPeriodReport(dateFrom, dateTo)
    : { contracts: 0, revenue: 0 };

  const secondPeriodValid =
    compareDateFrom &&
    compareDateTo &&
    compareDateFrom <= compareDateTo;

  const secondPeriodReport = secondPeriodValid
    ? getPeriodReport(compareDateFrom, compareDateTo)
    : { contracts: 0, revenue: 0 };

  const reportDepartmentRows = Object.values(
    reportContracts.reduce((result, contract) => {
      const department = contract.department?.trim() || "Не вказано";

      if (!result[department]) {
        result[department] = {
          department,
          contracts: 0,
          revenue: 0,
        };
      }

      result[department].contracts += 1;
      result[department].revenue += Number(contract.price || 0);
      return result;
    }, {})
  ).sort((a, b) => b.revenue - a.revenue);
    // Procurement forecast based on rental contracts from the last six months.
  const forecastMonths = 6;
  const futureForecastMonths = 3;
  const forecastEnd = new Date(`${today}T00:00:00`);
  const forecastStart = new Date(forecastEnd.getFullYear(), forecastEnd.getMonth() - (forecastMonths - 1), 1);
  const forecastStartDate = [
    forecastStart.getFullYear(),
    String(forecastStart.getMonth() + 1).padStart(2, "0"),
    "01",
  ].join("-");
  const forecastHistoryContracts = contracts.filter(
    (contract) => contract.startDate && contract.startDate >= forecastStartDate && contract.startDate <= today
  );
  const forecastDemandByEquipment = forecastHistoryContracts.reduce((result, contract) => {
    const item = equipment.find((equipmentItem) => equipmentItem.id === contract.equipmentId);
    const key = String(contract.equipmentId);
    if (!result[key]) {
      result[key] = {
        id: contract.equipmentId,
        name: item?.name || contract.equipmentName || "Не визначено",
        type: item?.type || "Не визначено",
        contracts: 0,
      };
    }
    result[key].contracts += 1;
    return result;
  }, {});

  const procurementForecastRows = Object.values(forecastDemandByEquipment)
    .map((item) => {
      const currentItem = equipment.find((equipmentItem) => equipmentItem.id === item.id);
      const currentQuantity = currentItem && currentItem.status !== "Списано"
        ? Number(currentItem.quantity || 0)
        : 0;
      const averageMonthlyDemand = item.contracts / forecastMonths;
      const recommendedQuantity = Math.ceil(averageMonthlyDemand * 1.2);
      const difference = recommendedQuantity - currentQuantity;
      return {
        ...item,
        currentQuantity,
        averageMonthlyDemand,
        recommendedQuantity,
        deficit: Math.max(0, difference),
        surplus: Math.max(0, -difference),
        status: difference > 0 ? "Дефіцит" : difference < 0 ? "Надлишок" : "Баланс",
      };
    })
    .sort((a, b) => b.averageMonthlyDemand - a.averageMonthlyDemand);

  const forecastTotalCurrent = procurementForecastRows.reduce((sum, item) => sum + item.currentQuantity, 0);
  const forecastTotalRecommended = procurementForecastRows.reduce((sum, item) => sum + item.recommendedQuantity, 0);
  const forecastTotalDeficit = procurementForecastRows.reduce((sum, item) => sum + item.deficit, 0);
  const forecastTotalSurplus = procurementForecastRows.reduce((sum, item) => sum + item.surplus, 0);

  const forecastMonthlyRows = Array.from({ length: futureForecastMonths }, (_, index) => {
    const monthDate = new Date(forecastEnd.getFullYear(), forecastEnd.getMonth() + index + 1, 1);
    const monthKey = [monthDate.getFullYear(), String(monthDate.getMonth() + 1).padStart(2, "0")].join("-");
    return {
      month: monthKey,
      demand: procurementForecastRows.reduce((sum, item) => sum + item.averageMonthlyDemand, 0),
      recommended: procurementForecastRows.reduce((sum, item) => sum + item.recommendedQuantity, 0),
    };
  });

  if (selectedSection?.history) {
    return (
      <RentalHistory
        onBack={() => setSelectedSection(null)}
        equipment={equipment}
        contracts={contracts}
      />
    );
  }

  if (selectedSection) {
    if (selectedSection.title === sections[0].title) {
      return (
        <main className="equipment-page">
          <div className="equipment-heading">
            <div>
              <span className="welcome-label">AURORARENT / КЕРІВНИК</span>
              <h1>{selectedSection.title}</h1>
              <p>{selectedSection.description}</p>
            </div>

            <button
              className="back-button"
              onClick={() => setSelectedSection(null)}
            >
              ← Назад
            </button>
          </div>

          <section className="equipment-panel">
            <div className="equipment-list-heading">
              <div>
                <h2>Повідомлення системи</h2>
                <p>
                  Автоматичний контроль кількості, технічного
                  обслуговування та простою обладнання
                </p>
              </div>
            </div>

            <div className="rental-summary">
              <div className="rental-summary-card">
                <span>Критична кількість</span>
                <strong>{criticalEquipment.length}</strong>
              </div>

              <div className="rental-summary-card">
                <span>Наближається ТО</span>
                <strong>{upcomingMaintenance.length}</strong>
              </div>

              <div className="rental-summary-card">
                <span>Тривалий простій</span>
                <strong>{idleEquipment.length}</strong>
              </div>
            </div>

            <div className="equipment-list-heading">
              <div>
                <h2>1. Повідомлення про критичний рівень кількості</h2>
                <p>
                  Обладнання, кількість якого становить одну одиницю
                  або менше
                </p>
              </div>
            </div>

            {criticalEquipment.length > 0 ? (
              <div className="equipment-table-wrapper">
                <table className="equipment-table">
                  <thead>
                    <tr>
                      <th>Обладнання</th>
                      <th>Виробник</th>
                      <th>Кількість</th>
                      <th>Повідомлення</th>
                    </tr>
                  </thead>

                  <tbody>
                    {criticalEquipment.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.manufacturer || "—"}</td>
                        <td>{item.quantity}</td>
                        <td>Критичний рівень кількості</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="equipment-empty">
                Обладнання з критичною кількістю не виявлено.
              </div>
            )}

            <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
              <div>
                <h2>2. Нагадування про технічне обслуговування</h2>
                <p>Заплановане ТО протягом найближчих 7 днів</p>
              </div>
            </div>

            {upcomingMaintenance.length > 0 ? (
              <div className="equipment-table-wrapper">
                <table className="equipment-table">
                  <thead>
                    <tr>
                      <th>Обладнання</th>
                      <th>Дата ТО</th>
                      <th>Вартість</th>
                    </tr>
                  </thead>

                  <tbody>
                    {upcomingMaintenance.map((record) => (
                      <tr key={record.id}>
                        <td>{record.equipmentName}</td>
                        <td>{formatDate(record.date)}</td>
                        <td>{formatMoney(record.cost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="equipment-empty">
                На найближчі 7 днів технічне обслуговування не заплановано.
              </div>
            )}

            <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
              <div>
                <h2>3. Повідомлення про тривалий простій обладнання</h2>
                <p>
                  Обладнання зі статусом «Доступно», який не змінювався
                  протягом 30 днів або більше
                </p>
              </div>
            </div>

            {idleEquipment.length > 0 ? (
              <div className="equipment-table-wrapper">
                <table className="equipment-table">
                  <thead>
                    <tr>
                      <th>Обладнання</th>
                      <th>Виробник</th>
                      <th>Остання зміна статусу</th>
                      <th>Днів без зміни</th>
                    </tr>
                  </thead>

                  <tbody>
                    {idleEquipment.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.manufacturer || "—"}</td>
                        <td>{formatDate(item.statusChangedAt)}</td>
                        <td>{getDaysBetween(item.statusChangedAt, today)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="equipment-empty">
                Обладнання з ознакою тривалого простою не виявлено.
              </div>
            )}
          </section>
        </main>
      );
    }

    if (selectedSection.title === sections[1].title) {
      return (
        <main className="equipment-page">
          <div className="equipment-heading">
            <div>
              <span className="welcome-label">AURORARENT / КЕРІВНИК</span>
              <h1>{selectedSection.title}</h1>
              <p>{selectedSection.description}</p>
            </div>

            <button
              className="back-button"
              onClick={() => setSelectedSection(null)}
            >
              ← Назад
            </button>
          </div>

          <section className="equipment-panel">
            <div className="equipment-list-heading">
              <div>
                <h2>Період статистики</h2>
                <p>Оберіть дати для формування статистичних показників</p>
              </div>
            </div>

            <div className="equipment-form-grid">
              <div className="equipment-field">
                <label htmlFor="statistics-date-from">Дата початку</label>
                <input
                  id="statistics-date-from"
                  type="date"
                  value={dateFrom}
                  max={dateTo}
                  onChange={(event) => setDateFrom(event.target.value)}
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="statistics-date-to">Дата завершення</label>
                <input
                  id="statistics-date-to"
                  type="date"
                  value={dateTo}
                  min={dateFrom}
                  max={today}
                  onChange={(event) => setDateTo(event.target.value)}
                />
              </div>
            </div>

            {!validPeriod ? (
              <div className="equipment-empty">
                Оберіть коректний період для перегляду статистики.
              </div>
            ) : (
              <>
                <div className="rental-summary" style={{ marginTop: "28px" }}>
                  <div className="rental-summary-card">
                    <span>Загальна вартість закупівель</span>
                    <strong>{formatMoney(totalPurchaseCost)}</strong>
                  </div>

                  <div className="rental-summary-card">
                    <span>Загальна вартість договорів оренди</span>
                    <strong>{formatMoney(totalRentalCost)}</strong>
                  </div>

                  <div className="rental-summary-card">
                    <span>Обладнання поза орендою</span>
                    <strong>{equipmentNotRented}</strong>
                  </div>
                </div>

                <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
                  <div>
                    <h2>Кількість замовлень за типами обладнання</h2>
                    <p>Кількість договорів оренди за обраний період</p>
                  </div>
                </div>

                {Object.keys(ordersByType).length > 0 ? (
                  <div className="equipment-table-wrapper">
                    <table className="equipment-table">
                      <thead>
                        <tr>
                          <th>Тип обладнання</th>
                          <th>Кількість замовлень</th>
                        </tr>
                      </thead>

                      <tbody>
                        {Object.entries(ordersByType).map(([type, count]) => (
                          <tr key={type}>
                            <td>{type}</td>
                            <td>{count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="equipment-empty">
                    За обраний період договорів оренди не знайдено.
                  </div>
                )}

                <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
                  <div>
                    <h2>Дані про закупівлі</h2>
                    <p>Зареєстроване обладнання, придбане за обраний період</p>
                  </div>
                </div>

                {periodEquipment.length > 0 ? (
                  <div className="equipment-table-wrapper">
                    <table className="equipment-table">
                      <thead>
                        <tr>
                          <th>Обладнання</th>
                          <th>Тип</th>
                          <th>Дата придбання</th>
                          <th>Кількість</th>
                          <th>Вартість</th>
                        </tr>
                      </thead>

                      <tbody>
                        {periodEquipment.map((item) => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.type || "—"}</td>
                            <td>{formatDate(item.purchaseDate)}</td>
                            <td>{item.quantity}</td>
                            <td>
                              {formatMoney(
                                Number(item.price || 0) *
                                  Number(item.quantity || 0)
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="equipment-empty">
                    За обраний період закупівель не знайдено.
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      );
    }
        if (selectedSection.title === sections[2].title) {
      return (
        <main className="equipment-page">
          <div className="equipment-heading">
            <div>
              <span className="welcome-label">AURORARENT / КЕРІВНИК</span>
              <h1>{selectedSection.title}</h1>
              <p>{selectedSection.description}</p>
            </div>

            <button
              className="back-button"
              onClick={() => setSelectedSection(null)}
            >
              ← Назад
            </button>
          </div>

          <section className="equipment-panel">
            <div className="equipment-list-heading">
              <div>
                <h2>Період аналізу</h2>
                <p>
                  Показники використання обладнання за обраний період
                </p>
              </div>
            </div>

            <div className="equipment-form-grid">
              <div className="equipment-field">
                <label htmlFor="analysis-date-from">Дата початку</label>
                <input
                  id="analysis-date-from"
                  type="date"
                  value={dateFrom}
                  max={dateTo}
                  onChange={(event) => setDateFrom(event.target.value)}
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="analysis-date-to">Дата завершення</label>
                <input
                  id="analysis-date-to"
                  type="date"
                  value={dateTo}
                  min={dateFrom}
                  max={today}
                  onChange={(event) => setDateTo(event.target.value)}
                />
              </div>
            </div>

            {!validPeriod ? (
              <div className="equipment-empty">
                Оберіть коректний період для аналізу.
              </div>
            ) : (
              <>
                <div className="rental-summary" style={{ marginTop: "28px" }}>
                  <div className="rental-summary-card">
                    <span>Загальна завантаженість обладнання</span>
                    <strong>{overallUtilization.toFixed(1)}%</strong>
                  </div>

                  <div className="rental-summary-card">
                    <span>Кількість договорів за період</span>
                    <strong>{overlappingContracts.length}</strong>
                  </div>

                  <div className="rental-summary-card">
                    <span>Днів оренди за період</span>
                    <strong>{totalRentedDays}</strong>
                  </div>
                </div>

                <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
                  <div>
                    <h2>1. Показники використання обладнання</h2>
                    <p>
                      Частка днів оренди від загальної кількості днів
                      обраного періоду
                    </p>
                  </div>
                </div>

                <div className="equipment-table-wrapper">
                  <table className="equipment-table">
                    <thead>
                      <tr>
                        <th>Обладнання</th>
                        <th>Тип</th>
                        <th>Днів оренди</th>
                        <th>Завантаженість</th>
                      </tr>
                    </thead>

                    <tbody>
                      {equipmentUtilization.length > 0 ? (
                        equipmentUtilization.map((item) => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.type || "—"}</td>
                            <td>{item.rentedDays}</td>
                            <td>{item.utilization.toFixed(1)}%</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">Обладнання відсутнє.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
                  <div>
                    <h2>2. Найбільш затребувані категорії</h2>
                    <p>
                      Категорії впорядковані за кількістю договорів оренди
                    </p>
                  </div>
                </div>

                {categoryStatistics.length > 0 ? (
                  <div className="equipment-table-wrapper">
                    <table className="equipment-table">
                      <thead>
                        <tr>
                          <th>Категорія</th>
                          <th>Кількість договорів</th>
                          <th>Завантаженість</th>
                        </tr>
                      </thead>

                      <tbody>
                        {categoryStatistics.map((item) => (
                          <tr key={item.type}>
                            <td>{item.type}</td>
                            <td>{item.contractCount}</td>
                            <td>{item.utilization.toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="equipment-empty">
                    Дані про категорії обладнання відсутні.
                  </div>
                )}

                <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
                  <div>
                    <h2>3. Обладнання з низькою завантаженістю</h2>
                    <p>
                      Обладнання, яке використовувалося менше ніж 20%
                      обраного періоду
                    </p>
                  </div>
                </div>

                {lowUtilizationEquipment.length > 0 ? (
                  <div className="equipment-table-wrapper">
                    <table className="equipment-table">
                      <thead>
                        <tr>
                          <th>Обладнання</th>
                          <th>Тип</th>
                          <th>Днів оренди</th>
                          <th>Завантаженість</th>
                        </tr>
                      </thead>

                      <tbody>
                        {lowUtilizationEquipment.map((item) => (
                          <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.type || "—"}</td>
                            <td>{item.rentedDays}</td>
                            <td>{item.utilization.toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="equipment-empty">
                    Обладнання з низькою завантаженістю не виявлено.
                  </div>
                )}

                <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
                  <div>
                    <h2>4. Інтенсивність використання за періодами</h2>
                    <p>
                      Розподіл договорів та днів оренди за місяцями
                    </p>
                  </div>
                </div>

                {monthlyRows.length > 0 ? (
                  <div className="equipment-table-wrapper">
                    <table className="equipment-table">
                      <thead>
                        <tr>
                          <th>Місяць</th>
                          <th>Кількість договорів</th>
                          <th>Днів оренди</th>
                        </tr>
                      </thead>

                      <tbody>
                        {monthlyRows.map((item) => (
                          <tr key={item.month}>
                            <td>{getMonthLabel(`${item.month}-01`)}</td>
                            <td>{item.contracts}</td>
                            <td>{item.rentalDays}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="equipment-empty">
                    За обраний період оренди не зафіксовано.
                  </div>
                )}

                <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
                  <div>
                    <h2>5. Порівняння підрозділів компанії</h2>
                    <p>
                      Порівняння кількості договорів та днів використання
                    </p>
                  </div>
                </div>

                {departmentRows.length > 0 ? (
                  <div className="equipment-table-wrapper">
                    <table className="equipment-table">
                      <thead>
                        <tr>
                          <th>Підрозділ</th>
                          <th>Кількість договорів</th>
                          <th>Днів оренди</th>
                        </tr>
                      </thead>

                      <tbody>
                        {departmentRows.map((item) => (
                          <tr key={item.department}>
                            <td>{item.department}</td>
                            <td>{item.contracts}</td>
                            <td>{item.rentalDays}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="equipment-empty">
                    Дані про підрозділи відсутні. Вкажіть підрозділ під час
                    створення договору оренди.
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      );
    }

    if (selectedSection.title === sections[3].title) {
      return (
        <main className="equipment-page">
          <div className="equipment-heading">
            <div>
              <span className="welcome-label">AURORARENT / КЕРІВНИК</span>
              <h1>{selectedSection.title}</h1>
              <p>{selectedSection.description}</p>
            </div>
            <button className="back-button" onClick={() => setSelectedSection(null)}>
              ← Назад
            </button>
          </div>

          <section className="equipment-panel">
            <div className="equipment-list-heading">
              <div>
                <h2>Прогноз попиту на обладнання</h2>
                <p>Розрахунок на основі договорів оренди за останні 6 місяців</p>
              </div>
            </div>

            <div className="rental-summary" style={{ marginTop: "20px" }}>
              <div className="rental-summary-card">
                <span>Наявна кількість</span>
                <strong>{forecastTotalCurrent}</strong>
              </div>
              <div className="rental-summary-card">
                <span>Рекомендована кількість</span>
                <strong>{forecastTotalRecommended}</strong>
              </div>
              <div className="rental-summary-card">
                <span>Загальний дефіцит</span>
                <strong>{forecastTotalDeficit}</strong>
              </div>
              <div className="rental-summary-card">
                <span>Загальний надлишок</span>
                <strong>{forecastTotalSurplus}</strong>
              </div>
            </div>

            <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
              <div>
                <h2>1. Прогнозування попиту на основі історичних даних</h2>
                <p>Середня кількість договорів на місяць та прогнозований попит</p>
              </div>
            </div>

            {procurementForecastRows.length > 0 ? (
              <div className="equipment-table-wrapper">
                <table className="equipment-table">
                  <thead>
                    <tr>
                      <th>Обладнання</th>
                      <th>Категорія</th>
                      <th>Договорів за 6 міс.</th>
                      <th>Середній попит / місяць</th>
                    </tr>
                  </thead>
                  <tbody>
                    {procurementForecastRows.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.type}</td>
                        <td>{item.contracts}</td>
                        <td>{item.averageMonthlyDemand.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="equipment-empty">За останні 6 місяців договорів оренди не знайдено. Для прогнозу потрібна історія оренди.</div>
            )}

            <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
              <div>
                <h2>2. Розрахунок необхідної кількості одиниць обладнання</h2>
                <p>Рекомендована кількість включає резерв 20% від середнього місячного попиту</p>
              </div>
            </div>

            {procurementForecastRows.length > 0 && (
              <div className="equipment-table-wrapper">
                <table className="equipment-table">
                  <thead>
                    <tr>
                      <th>Обладнання</th>
                      <th>Наявна кількість</th>
                      <th>Середній попит / місяць</th>
                      <th>Рекомендовано мати</th>
                      <th>Рекомендація</th>
                    </tr>
                  </thead>
                  <tbody>
                    {procurementForecastRows.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.currentQuantity}</td>
                        <td>{item.averageMonthlyDemand.toFixed(1)}</td>
                        <td>{item.recommendedQuantity}</td>
                        <td>{item.status === "Дефіцит" ? `Закупити ${item.deficit} од.` : item.status === "Надлишок" ? `Надлишок ${item.surplus} од.` : "Кількість достатня"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
              <div>
                <h2>3. Дефіцит і надлишок обладнання за періодами</h2>
                <p>Орієнтовний прогноз попиту на наступні три місяці</p>
              </div>
            </div>

            {procurementForecastRows.length > 0 ? (
              <div className="equipment-table-wrapper">
                <table className="equipment-table">
                  <thead>
                    <tr>
                      <th>Період</th>
                      <th>Прогнозований попит</th>
                      <th>Рекомендований запас</th>
                      <th>Поточний запас</th>
                      <th>Стан</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecastMonthlyRows.map((item) => (
                      <tr key={item.month}>
                        <td>{getMonthLabel(`${item.month}-01`)}</td>
                        <td>{item.demand.toFixed(1)} од.</td>
                        <td>{item.recommended} од.</td>
                        <td>{forecastTotalCurrent} од.</td>
                        <td>{forecastTotalCurrent < item.recommended ? `Дефіцит ${item.recommended - forecastTotalCurrent} од.` : forecastTotalCurrent > item.recommended ? `Надлишок ${forecastTotalCurrent - item.recommended} од.` : "Баланс"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="equipment-empty">Недостатньо історичних даних для прогнозу.</div>
            )}

            <p style={{ marginTop: "24px", opacity: 0.75 }}>
              Примітка: прогноз є орієнтовним і базується на кількості договорів за останні 6 місяців. Для розрахунку використовується середній місячний попит із резервом 20%. Дані не враховують сезонність та попит, який не завершився договором.
            </p>
          </section>
        </main>
      );
    }
        if (selectedSection.title === sections[4].title) {
      return (
        <main className="equipment-page">
          <div className="equipment-heading">
            <div>
              <span className="welcome-label">AURORARENT / КЕРІВНИК</span>
              <h1>{selectedSection.title}</h1>
              <p>{selectedSection.description}</p>
            </div>

            <button
              className="back-button"
              onClick={() => setSelectedSection(null)}
            >
              ← Назад
            </button>
          </div>

          <section className="equipment-panel">
            <div className="equipment-list-heading">
              <div>
                <h2>Період формування звітів</h2>
                <p>Оберіть період для формування аналітичної інформації</p>
              </div>

              <button
                className="equipment-add-button"
                type="button"
                onClick={() => window.print()}
              >
                Експортувати PDF
              </button>
            </div>

            <div className="equipment-form-grid">
              <div className="equipment-field">
                <label htmlFor="reports-date-from">Дата початку</label>
                <input
                  id="reports-date-from"
                  type="date"
                  value={dateFrom}
                  max={dateTo}
                  onChange={(event) => setDateFrom(event.target.value)}
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="reports-date-to">Дата завершення</label>
                <input
                  id="reports-date-to"
                  type="date"
                  value={dateTo}
                  min={dateFrom}
                  max={today}
                  onChange={(event) => setDateTo(event.target.value)}
                />
              </div>
            </div>

            {!validPeriod ? (
              <div className="equipment-empty">
                Оберіть коректний період.
              </div>
            ) : (
              <>
                <div className="rental-summary" style={{ marginTop: "28px" }}>
                  <div className="rental-summary-card">
                    <span>Кількість договорів</span>
                    <strong>{reportContracts.length}</strong>
                  </div>

                  <div className="rental-summary-card">
                    <span>Дохід від оренди</span>
                    <strong>{formatMoney(firstPeriodReport.revenue)}</strong>
                  </div>

                  <div className="rental-summary-card">
                    <span>Кількість категорій</span>
                    <strong>{profitabilityRows.length}</strong>
                  </div>
                </div>

                <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
                  <div>
                    <h2>1. Звіти по затребуваності обладнання</h2>
                    <p>Рейтинг обладнання за кількістю договорів оренди</p>
                  </div>
                </div>

                {demandRows.length > 0 ? (
                  <div className="equipment-table-wrapper">
                    <table className="equipment-table">
                      <thead>
                        <tr>
                          <th>Обладнання</th>
                          <th>Категорія</th>
                          <th>Кількість договорів</th>
                          <th>Дохід</th>
                        </tr>
                      </thead>
                      <tbody>
                        {demandRows.map((item) => (
                          <tr key={item.name}>
                            <td>{item.name}</td>
                            <td>{item.type}</td>
                            <td>{item.contracts}</td>
                            <td>{formatMoney(item.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="equipment-empty">
                    За обраний період договорів не знайдено.
                  </div>
                )}

                <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
                  <div>
                    <h2>2. Звіти по прибутковості категорій обладнання</h2>
                    <p>Дохід від оренди та витрати на обслуговування</p>
                  </div>
                </div>

                {profitabilityRows.length > 0 ? (
                  <div className="equipment-table-wrapper">
                    <table className="equipment-table">
                      <thead>
                        <tr>
                          <th>Категорія</th>
                          <th>Договори</th>
                          <th>Дохід</th>
                          <th>Витрати на ТО</th>
                          <th>Різниця</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profitabilityRows.map((item) => (
                          <tr key={item.type}>
                            <td>{item.type}</td>
                            <td>{item.contracts}</td>
                            <td>{formatMoney(item.revenue)}</td>
                            <td>{formatMoney(item.maintenanceCost)}</td>
                            <td>{formatMoney(item.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="equipment-empty">
                    Дані про прибутковість відсутні.
                  </div>
                )}

                <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
                  <div>
                    <h2>3. Порівняльні звіти за різні періоди</h2>
                    <p>Порівняння кількості договорів та доходу</p>
                  </div>
                </div>

                <div className="equipment-form-grid">
                  <div className="equipment-field">
                    <label htmlFor="reports-compare-from">Початок другого періоду</label>
                    <input
                      id="reports-compare-from"
                      type="date"
                      value={compareDateFrom}
                      max={compareDateTo}
                      onChange={(event) => setCompareDateFrom(event.target.value)}
                    />
                  </div>

                  <div className="equipment-field">
                    <label htmlFor="reports-compare-to">Завершення другого періоду</label>
                    <input
                      id="reports-compare-to"
                      type="date"
                      value={compareDateTo}
                      min={compareDateFrom}
                      max={today}
                      onChange={(event) => setCompareDateTo(event.target.value)}
                    />
                  </div>
                </div>

                {secondPeriodValid ? (
                  <div className="equipment-table-wrapper">
                    <table className="equipment-table">
                      <thead>
                        <tr>
                          <th>Показник</th>
                          <th>Перший період</th>
                          <th>Другий період</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Кількість договорів</td>
                          <td>{firstPeriodReport.contracts}</td>
                          <td>{secondPeriodReport.contracts}</td>
                        </tr>
                        <tr>
                          <td>Дохід від оренди</td>
                          <td>{formatMoney(firstPeriodReport.revenue)}</td>
                          <td>{formatMoney(secondPeriodReport.revenue)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="equipment-empty">
                    Оберіть коректний другий період.
                  </div>
                )}

                <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
                  <div>
                    <h2>4. Порівняння за підрозділами</h2>
                    <p>Кількість договорів та дохід кожного підрозділу</p>
                  </div>
                </div>

                {reportDepartmentRows.length > 0 ? (
                  <div className="equipment-table-wrapper">
                    <table className="equipment-table">
                      <thead>
                        <tr>
                          <th>Підрозділ</th>
                          <th>Кількість договорів</th>
                          <th>Дохід</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportDepartmentRows.map((item) => (
                          <tr key={item.department}>
                            <td>{item.department}</td>
                            <td>{item.contracts}</td>
                            <td>{formatMoney(item.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="equipment-empty">
                    Дані про підрозділи відсутні.
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      );
    }
        if (selectedSection.title === sections[5].title) {
      const metricContracts = validPeriod ? overlappingContracts : [];
      const metricRentalDays = metricContracts.reduce(
        (total, contract) => total + getInclusiveDays(contract.startDate, contract.endDate),
        0
      );
      const averageRentalDuration =
        metricContracts.length > 0
          ? metricRentalDays / metricContracts.length
          : 0;
      const contractsStartedInPeriod = validPeriod
        ? contracts.filter(
            (contract) =>
              contract.startDate >= dateFrom && contract.startDate <= dateTo
          )
        : [];
      const periodMonths = validPeriod
        ? Math.max(1,
            (new Date(`${dateTo}T00:00:00`).getFullYear() -
              new Date(`${dateFrom}T00:00:00`).getFullYear()) *
              12 +
              new Date(`${dateTo}T00:00:00`).getMonth() -
              new Date(`${dateFrom}T00:00:00`).getMonth() +
              1
          )
        : 0;
      const frequencyRows = equipment
        .filter((item) => item.status !== "Списано")
        .map((item) => {
          const itemContracts = contractsStartedInPeriod.filter(
            (contract) => contract.equipmentId === item.id
          );
          return {
            ...item,
            contractCount: itemContracts.length,
            monthlyFrequency: periodMonths > 0
              ? itemContracts.length / periodMonths
              : 0,
          };
        })
        .sort((a, b) => b.contractCount - a.contractCount);
      const metricRevenue = contractsStartedInPeriod.reduce(
        (total, contract) => total + Number(contract.price || 0),
        0
      );
      const metricMaintenanceCost = maintenanceRecords
        .filter((record) => validPeriod && record.date >= dateFrom && record.date <= dateTo)
        .reduce((total, record) => total + Number(record.cost || 0), 0);
      const rejectedContracts = contracts.filter((contract) => {
        const status = String(contract.status || "").toLowerCase();
        return status.includes("відмов") || status.includes("відхил") ||
          status.includes("reject") || status.includes("declin");
      });
      const downtimeRows = equipment
        .filter(
          (item) =>
            item.status === "Доступно" &&
            item.statusChangedAt &&
            getDaysBetween(item.statusChangedAt, today) >= 1
        )
        .map((item) => ({
          ...item,
          idleDays: getDaysBetween(item.statusChangedAt, today),
        }))
        .sort((a, b) => b.idleDays - a.idleDays);

      return (
        <main className="equipment-page">
          <div className="equipment-heading">
            <div>
              <span className="welcome-label">AURORARENT / КЕРІВНИК</span>
              <h1>{selectedSection.title}</h1>
              <p>{selectedSection.description}</p>
            </div>
            <button className="back-button" onClick={() => setSelectedSection(null)}>
              ← Назад
            </button>
          </div>

          <section className="equipment-panel">
            <div className="equipment-list-heading">
              <div>
                <h2>Моніторинг показників роботи системи</h2>
                <p>Оберіть період для перегляду ключових показників оренди та використання обладнання</p>
              </div>
            </div>

            <div className="equipment-form-grid">
              <div className="equipment-field">
                <label htmlFor="metrics-date-from">Дата початку</label>
                <input id="metrics-date-from" type="date" value={dateFrom} max={dateTo} onChange={(event) => setDateFrom(event.target.value)} />
              </div>
              <div className="equipment-field">
                <label htmlFor="metrics-date-to">Дата завершення</label>
                <input id="metrics-date-to" type="date" value={dateTo} min={dateFrom} max={today} onChange={(event) => setDateTo(event.target.value)} />
              </div>
            </div>

            {!validPeriod ? (
              <div className="equipment-empty">Оберіть коректний період.</div>
            ) : (
              <>
                <div className="rental-summary" style={{ marginTop: "28px" }}>
                  <div className="rental-summary-card">
                    <span>Коефіцієнт завантаження</span>
                    <strong>{overallUtilization.toFixed(1)}%</strong>
                  </div>
                  <div className="rental-summary-card">
                    <span>Середня тривалість оренди</span>
                    <strong>{averageRentalDuration.toFixed(1)} дн.</strong>
                  </div>
                  <div className="rental-summary-card">
                    <span>Договори за період</span>
                    <strong>{contractsStartedInPeriod.length}</strong>
                  </div>
                  <div className="rental-summary-card">
                    <span>Дохід від оренди</span>
                    <strong>{formatMoney(metricRevenue)}</strong>
                  </div>
                </div>

                <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
                  <div>
                    <h2>1. Контроль коефіцієнта завантаження обладнання</h2>
                    <p>Частка днів оренди від загальної доступної кількості днів обладнання за обраний період</p>
                  </div>
                </div>
                <div className="equipment-table-wrapper">
                  <table className="equipment-table">
                    <thead><tr><th>Обладнання</th><th>Категорія</th><th>Дні оренди</th><th>Завантаження</th></tr></thead>
                    <tbody>
                      {equipmentUtilization.map((item) => (
                        <tr key={item.id}><td>{item.name}</td><td>{item.type || "—"}</td><td>{item.rentedDays}</td><td>{item.utilization.toFixed(1)}%</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
                  <div><h2>2. Визначення середньої тривалості оренди</h2><p>Середня кількість календарних днів на один договір, що перетинається з обраним періодом</p></div>
                </div>
                <div className="rental-summary"><div className="rental-summary-card"><span>Середня тривалість</span><strong>{averageRentalDuration.toFixed(1)} дн.</strong></div><div className="rental-summary-card"><span>Загальна кількість днів оренди</span><strong>{metricRentalDays}</strong></div><div className="rental-summary-card"><span>Договори, що перетинаються з періодом</span><strong>{metricContracts.length}</strong></div></div>

                <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
                  <div><h2>3. Визначення частоти використання обладнання</h2><p>Кількість нових договорів оренди для кожної позиції за обраний період</p></div>
                </div>
                <div className="equipment-table-wrapper">
                  <table className="equipment-table">
                    <thead><tr><th>Обладнання</th><th>Кількість договорів</th><th>У середньому на місяць</th></tr></thead>
                    <tbody>{frequencyRows.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.contractCount}</td><td>{item.monthlyFrequency.toFixed(2)}</td></tr>)}</tbody>
                  </table>
                </div>

                <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
                  <div><h2>4. Відстеження кількості відмов клієнтам</h2><p>Підрахунок заявок або договорів зі статусом відмови</p></div>
                </div>
                <div className="rental-summary"><div className="rental-summary-card"><span>Зафіксовані відмови</span><strong>{rejectedContracts.length}</strong></div></div>
                <div className="equipment-empty">{rejectedContracts.length > 0 ? "Враховано записи зі статусом, що містить ознаку відмови або відхилення." : "У поточній структурі даних немає окремого журналу відмов клієнтам або статусів відмови, тому показник дорівнює 0 лише серед наявних записів і не підтверджує відсутність фактичних відмов."}</div>

                <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
                  <div><h2>5. Визначення фінансових показників оренди</h2><p>Дохід від договорів мінус зафіксовані витрати на технічне обслуговування</p></div>
                </div>
                <div className="rental-summary"><div className="rental-summary-card"><span>Дохід від оренди</span><strong>{formatMoney(metricRevenue)}</strong></div><div className="rental-summary-card"><span>Витрати на обслуговування</span><strong>{formatMoney(metricMaintenanceCost)}</strong></div><div className="rental-summary-card"><span>Фінансовий результат</span><strong>{formatMoney(metricRevenue - metricMaintenanceCost)}</strong></div></div>

                <div className="equipment-list-heading" style={{ marginTop: "32px" }}>
                  <div><h2>6. Контроль простою обладнання</h2><p>Обладнання зі статусом «Доступно», яке не перебуває в оренді тривалий час після останньої зміни статусу</p></div>
                </div>
                {downtimeRows.length > 0 ? (
                  <div className="equipment-table-wrapper"><table className="equipment-table"><thead><tr><th>Обладнання</th><th>Кількість</th><th>Днів без оренди</th><th>Остання зміна статусу</th></tr></thead><tbody>{downtimeRows.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.quantity}</td><td>{item.idleDays}</td><td>{formatDate(item.statusChangedAt)}</td></tr>)}</tbody></table></div>
                ) : (
                  <div className="equipment-empty">Немає обладнання зі статусом «Доступно», для якого зафіксовано дату останньої зміни статусу.</div>
                )}
              </>
            )}
            <p style={{ marginTop: "24px", opacity: 0.75 }}>Примітка: коефіцієнт завантаження розраховується за днями оренди та доступними днями обладнання. Фінансовий результат враховує лише дохід за договорами та витрати на ТО, наявні в системі. Для точного обліку відмов потрібен окремий запис заявок/відмов. Показник простою орієнтовний і базується на даті останньої зміни статусу.</p>
          </section>
        </main>
      );
    }
    if (selectedSection.title === sections[6].title) {
      const recommendations = [];

      // Recommendations for equipment procurement.
      procurementForecastRows
        .filter((item) => item.deficit > 0)
        .forEach((item) => {
          recommendations.push({
            id: `purchase-${item.id}`,
            type: "Закупівля",
            priority: "Високий",
            title: `Розглянути закупівлю обладнання «${item.name}»`,
            description: `Поточна кількість — ${item.currentQuantity} од., рекомендована — ${item.recommendedQuantity} од. Орієнтовний дефіцит становить ${item.deficit} од.`,
          });
        });

      // Recommendations for equipment with low utilization.
      equipmentUtilization
        .filter(
          (item) =>
            item.utilization < 20 &&
            Number(item.quantity || 0) > 0
        )
        .forEach((item) => {
          recommendations.push({
            id: `redistribute-${item.id}`,
            type: "Перерозподіл",
            priority: "Середній",
            title: `Перевірити доцільність використання «${item.name}»`,
            description: `Завантаженість за обраний період — ${item.utilization.toFixed(1)}%. Варто перевірити потреби інших підрозділів та можливість перерозподілу обладнання.`,
          });
        });

      // Recommendations for equipment with long idle periods.
      equipment
        .filter(
          (item) =>
            item.status === "Доступно" &&
            item.statusChangedAt &&
            getDaysBetween(item.statusChangedAt, today) >= 30
        )
        .forEach((item) => {
          recommendations.push({
            id: `idle-${item.id}`,
            type: "Простій",
            priority: "Середній",
            title: `Перевірити причину простою «${item.name}»`,
            description: `Обладнання доступне, але статус не змінювався ${getDaysBetween(item.statusChangedAt, today)} днів. Рекомендується перевірити попит, стан та можливість передачі іншому підрозділу.`,
          });
        });

      // Recommendations based on maintenance history.
      const maintenanceByEquipment = maintenanceRecords.reduce(
        (result, record) => {
          const key = String(record.equipmentId);

          if (!result[key]) {
            result[key] = { count: 0, cost: 0 };
          }

          result[key].count += 1;
          result[key].cost += Number(record.cost || 0);

          return result;
        },
        {}
      );

      equipment.forEach((item) => {
        const maintenance =
          maintenanceByEquipment[String(item.id)];

        if (maintenance && maintenance.count >= 3) {
          recommendations.push({
            id: `maintenance-${item.id}`,
            type: "Обслуговування",
            priority: "Середній",
            title: `Оцінити витрати на обслуговування «${item.name}»`,
            description: `Зафіксовано ${maintenance.count} записів ТО на суму ${formatMoney(maintenance.cost)}. Варто оцінити технічний стан та доцільність подальшого обслуговування.`,
          });
        }
      });

      // Default recommendation when no issues are detected.
      if (recommendations.length === 0) {
        recommendations.push({
          id: "general-review",
          type: "Загальна рекомендація",
          priority: "Низький",
          title: "Продовжувати регулярний моніторинг обладнання",
          description:
            "За наявними даними критичних потреб у закупівлі, тривалого простою або низької завантаженості не виявлено. Переглядайте показники після оновлення договорів та записів технічного обслуговування.",
        });
      }

      const highPriorityCount = recommendations.filter(
        (item) => item.priority === "Високий"
      ).length;

      const mediumPriorityCount = recommendations.filter(
        (item) => item.priority === "Середній"
      ).length;

      return (
        <main className="equipment-page">
          <div className="equipment-heading">
            <div>
              <span className="welcome-label">
                AURORARENT / КЕРІВНИК
              </span>
              <h1>{selectedSection.title}</h1>
              <p>{selectedSection.description}</p>
            </div>

            <button
              className="back-button"
              onClick={() => setSelectedSection(null)}
            >
              ← Назад
            </button>
          </div>

          <section className="equipment-panel">
            <div className="equipment-list-heading">
              <div>
                <h2>Рекомендації щодо управління обладнанням</h2>
                <p>
                  Автоматично сформовані пропозиції на основі
                  завантаженості, попиту, простою та історії
                  технічного обслуговування
                </p>
              </div>
            </div>

            <div
              className="rental-summary"
              style={{ marginTop: "20px" }}
            >
              <div className="rental-summary-card">
                <span>Усього рекомендацій</span>
                <strong>{recommendations.length}</strong>
              </div>

              <div className="rental-summary-card">
                <span>Високий пріоритет</span>
                <strong>{highPriorityCount}</strong>
              </div>

              <div className="rental-summary-card">
                <span>Середній пріоритет</span>
                <strong>{mediumPriorityCount}</strong>
              </div>
            </div>

            <div
              className="equipment-list-heading"
              style={{ marginTop: "32px" }}
            >
              <div>
                <h2>Сформовані рекомендації</h2>
                <p>
                  Пропозиції для прийняття управлінських рішень
                </p>
              </div>
            </div>

            <div className="equipment-table-wrapper">
              <table className="equipment-table">
                <thead>
                  <tr>
                    <th>Напрям</th>
                    <th>Пріоритет</th>
                    <th>Рекомендація</th>
                    <th>Обґрунтування</th>
                  </tr>
                </thead>

                <tbody>
                  {recommendations.map((item) => (
                    <tr key={item.id}>
                      <td>{item.type}</td>
                      <td>{item.priority}</td>
                      <td>{item.title}</td>
                      <td>{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ marginTop: "24px", opacity: 0.75 }}>
              Примітка: рекомендації формуються автоматично на
              основі наявних у системі даних. Вони мають
              інформаційний характер і не створюють замовлення
              на закупівлю чи заявку на технічне обслуговування.
            </p>
          </section>
        </main>
      );
    }
    return (
      <main className="equipment-page">
        <div className="equipment-heading">
          <div>
            <span className="welcome-label">AURORARENT / КЕРІВНИК</span>
            <h1>{selectedSection.title}</h1>
            <p>{selectedSection.description}</p>
          </div>

          <button
            className="back-button"
            onClick={() => setSelectedSection(null)}
          >
            ← Назад
          </button>
        </div>

        <section className="equipment-panel">
          <div className="equipment-list-heading">
            <div>
              <h2>{selectedSection.title}</h2>
              <p>{selectedSection.details}</p>
            </div>
          </div>

          <div className="equipment-empty">
            Демонстраційний розділ. Інформація буде доступна після
            наповнення системи відповідними даними.
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <div className="dashboard-logo-icon">A</div>
          <span>AuroraRent</span>
        </div>

        <nav className="top-navigation">
          <span className="nav-item active">Головна</span>
          <span className="nav-item">Аналітика</span>
          <span className="nav-item">Звіти</span>
        </nav>

        <div className="dashboard-user">
          <div className="user-avatar">К</div>

          <div className="user-info">
            <span className="user-name">Керівник</span>
            <span className="user-role">Керівник системи</span>
          </div>

          <button
            className="logout-button"
            onClick={onLogout}
            title="Вийти"
          >
            ↗
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="sections-heading">
          <div>
            <span className="welcome-label">AURORARENT / КЕРІВНИК</span>
            <h1>Функції керівника</h1>
            <p>Аналітика, контроль та управління обладнанням</p>
          </div>
        </div>

        <div className="dashboard-grid">
          {sections.map((section, index) => (
            <div
              className="dashboard-card"
              key={section.title}
              onClick={() => setSelectedSection(section)}
            >
              <div className="card-top">
                <div className={`section-icon ${section.color}`}>
                  {section.icon}
                </div>

                <span className="card-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h2>{section.title}</h2>
              <p>{section.description}</p>

              <div className="card-arrow">
                Перейти <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="dashboard-footer">
        <span>© 2026 AuroraRent</span>
        <span>Система управління орендою обладнання</span>
      </footer>
    </div>
  );
}

export default LeaderDashboard;