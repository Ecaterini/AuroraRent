import { useState } from "react";
import "../../App.css";

import Directories from "./Directories";
import Equipment from "./Equipment";
import Maintenance from "./Maintenance";
import Movement from "./Movement";
import EquipmentStatus from "./EquipmentStatus";
import RentalContracts from "./RentalContracts";
import Clients from "./Clients";
import RentalTerms from "./RentalTerms";
import RentalHistory from "./RentalHistory";
import Users from "./Users";

const initialDirectories = {
  "Виробник": ["Bosch", "Makita", "DeWalt"],
  "Постачальник": ["ТОВ Техно-Сервіс", "БудПостач"],
  "Тип обладнання": ["Електроінструмент", "Будівельна техніка"],
  "Характеристика": ["Потужність", "Вага", "Напруга"],
  "Підрозділ": ["Будівельний відділ", "Технічний відділ"],
};

const sections = [
  {
    icon: "▦",
    title: "Ведення довідників",
    description: "Категорії, типи, характеристики та підрозділи",
    color: "lavender",
  },
  {
    icon: "▣",
    title: "Реєстрація обладнання",
    description: "Додавання та редагування одиниць обладнання",
    color: "blue",
  },
  {
    icon: "◉",
    title: "Стан обладнання",
    description: "Контроль поточного стану та доступності",
    color: "mint",
  },
  {
    icon: "⚙",
    title: "Обслуговування і ремонт",
    description: "Облік технічного обслуговування та ремонтів",
    color: "peach",
  },
  {
    icon: "⇄",
    title: "Переміщення обладнання",
    description: "Облік переміщень між підрозділами",
    color: "blue",
  },
  {
    icon: "▤",
    title: "Договори оренди",
    description: "Реєстрація договорів на оренду обладнання",
    color: "lavender",
  },
  {
    icon: "♙",
    title: "Інформація про клієнтів",
    description: "Реєстрація та перегляд даних клієнтів",
    color: "mint",
  },
  {
    icon: "◷",
    title: "Строки оренди",
    description: "Облік періодів оренди та повернення",
    color: "peach",
  },
  {
    icon: "↗",
    title: "Історія оренди",
    description: "Перегляд історії оренди обладнання",
    color: "blue",
  },
  {
    icon: "♧",
    title: "Користувачі та права",
    description: "Реєстрація користувачів і розмежування прав",
    color: "lavender",
  },
];

function Dashboard({
  onLogout,
  equipment,
  setEquipment,
  maintenanceRecords,
  setMaintenanceRecords,
  contracts,
  setContracts,
}) {
  const [showDirectories, setShowDirectories] = useState(false);
  const [showEquipment, setShowEquipment] = useState(false);
  const [showEquipmentStatus, setShowEquipmentStatus] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [showMovement, setShowMovement] = useState(false);
  const [showRentalContracts, setShowRentalContracts] = useState(false);
  const [showClients, setShowClients] = useState(false);
  const [showRentalTerms, setShowRentalTerms] = useState(false);
  const [showRentalHistory, setShowRentalHistory] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  const [directories, setDirectories] = useState(initialDirectories);
  const [deletedValues, setDeletedValues] = useState({});

  const [movementRecords, setMovementRecords] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);

  if (showDirectories) {
    return (
      <Directories
        onBack={() => setShowDirectories(false)}
        directories={directories}
        setDirectories={setDirectories}
        deletedValues={deletedValues}
        setDeletedValues={setDeletedValues}
      />
    );
  }

  if (showEquipment) {
    return (
      <Equipment
        onBack={() => setShowEquipment(false)}
        directories={directories}
        setDirectories={setDirectories}
        deletedValues={deletedValues}
        equipment={equipment}
        setEquipment={setEquipment}
      />
    );
  }

  if (showEquipmentStatus) {
    return (
      <EquipmentStatus
        onBack={() => setShowEquipmentStatus(false)}
        equipment={equipment}
        setEquipment={setEquipment}
      />
    );
  }

  if (showMaintenance) {
    return (
      <Maintenance
        onBack={() => setShowMaintenance(false)}
        equipment={equipment}
        maintenanceRecords={maintenanceRecords}
        setMaintenanceRecords={setMaintenanceRecords}
      />
    );
  }

  if (showMovement) {
    return (
      <Movement
        onBack={() => setShowMovement(false)}
        equipment={equipment}
        setEquipment={setEquipment}
        directories={directories}
        movementRecords={movementRecords}
        setMovementRecords={setMovementRecords}
      />
    );
  }

  if (showRentalContracts) {
    return (
      <RentalContracts
        onBack={() => setShowRentalContracts(false)}
        equipment={equipment}
        setEquipment={setEquipment}
        contracts={contracts}
        setContracts={setContracts}
      />
    );
  }

  if (showClients) {
    return (
      <Clients
        onBack={() => setShowClients(false)}
        clients={clients}
        setClients={setClients}
      />
    );
  }

  if (showRentalTerms) {
    return (
      <RentalTerms
        onBack={() => setShowRentalTerms(false)}
        contracts={contracts}
        setContracts={setContracts}
        equipment={equipment}
        setEquipment={setEquipment}
      />
    );
  }

  if (showRentalHistory) {
    return (
      <RentalHistory
        onBack={() => setShowRentalHistory(false)}
        equipment={equipment}
        contracts={contracts}
      />
    );
  }

  if (showUsers) {
    return (
      <Users
        onBack={() => setShowUsers(false)}
        users={users}
        setUsers={setUsers}
      />
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
          <span className="nav-item">Довідники</span>
          <span className="nav-item">Обладнання</span>
          <span className="nav-item">Оренда</span>
          <span className="nav-item">Користувачі</span>
        </nav>

        <div className="dashboard-user">
          <div className="user-avatar">М</div>

          <div className="user-info">
            <span className="user-name">Менеджер</span>
            <span className="user-role">Менеджер системи</span>
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
            <span className="welcome-label">
              AURORARENT / МЕНЕДЖЕР
            </span>

            <h1>Функції менеджера</h1>

            <p>Оберіть потрібний розділ для роботи</p>
          </div>
        </div>

        <div className="dashboard-grid">
          {sections.map((section, index) => (
            <div
              className="dashboard-card"
              key={section.title}
              onClick={
                index === 0
                  ? () => setShowDirectories(true)
                  : index === 1
                    ? () => setShowEquipment(true)
                    : index === 2
                      ? () => setShowEquipmentStatus(true)
                      : index === 3
                        ? () => setShowMaintenance(true)
                        : index === 4
                          ? () => setShowMovement(true)
                          : index === 5
                            ? () => setShowRentalContracts(true)
                            : index === 6
                              ? () => setShowClients(true)
                              : index === 7
                                ? () => setShowRentalTerms(true)
                                : index === 8
                                  ? () => setShowRentalHistory(true)
                                  : index === 9
                                    ? () => setShowUsers(true)
                                    : undefined
              }
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

export default Dashboard;