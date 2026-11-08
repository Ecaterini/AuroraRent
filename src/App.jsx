import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/manager/Dashboard";
import GuestCatalog from "./pages/guest/GuestCatalog";
import LeaderDashboard from "./pages/leader/LeaderDashboard";

const initialEquipment = [
  {
    id: 1,
    name: "Перфоратор Bosch GBH 2-26",
    manufacturer: "Bosch",
    type: "Електроінструмент",
    accounting: "Фізичні одиниці",
    quantity: 1,
    purchaseDate: "2026-05-10",
    supplier: "ТОВ Техно-Сервіс",
    price: 250,
    description: "Професійний перфоратор",
    characteristics: [
      { name: "Потужність", value: "800 Вт" },
      { name: "Вага", value: "2,5 кг" },
    ],
  },
  {
    id: 2,
    name: "Шуруповерт Makita DDF482",
    manufacturer: "Makita",
    type: "Електроінструмент",
    accounting: "Фізичні одиниці",
    quantity: 3,
    purchaseDate: "2026-06-15",
    supplier: "БудПостач",
    price: 180,
    description: "Акумуляторний шуруповерт",
    characteristics: [{ name: "Напруга", value: "18 В" }],
  },
  {
    id: 3,
    name: "Будівельна драбина",
    manufacturer: "DeWalt",
    type: "Будівельне обладнання",
    accounting: "За кількістю",
    quantity: 5,
    purchaseDate: "2026-07-01",
    supplier: "ТОВ Техно-Сервіс",
    price: 75,
    description: "Алюмінієва драбина",
    characteristics: [{ name: "Вага", value: "6 кг" }],
  },
];

function App() {
  const [userRole, setUserRole] = useState(null);

  const [equipment, setEquipment] = useState(initialEquipment);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [contracts, setContracts] = useState([]);

  const handleLogout = () => {
    setUserRole(null);
  };

  if (userRole === "manager") {
    return (
      <Dashboard
        onLogout={handleLogout}
        equipment={equipment}
        setEquipment={setEquipment}
        maintenanceRecords={maintenanceRecords}
        setMaintenanceRecords={setMaintenanceRecords}
        contracts={contracts}
        setContracts={setContracts}
      />
    );
  }

  if (userRole === "guest") {
    return <GuestCatalog onLogout={handleLogout} />;
  }

  if (userRole === "leader") {
    return (
      <LeaderDashboard
        onLogout={handleLogout}
        equipment={equipment}
        maintenanceRecords={maintenanceRecords}
        contracts={contracts}
      />
    );
  }

  return <Login onLogin={setUserRole} />;
}

export default App;