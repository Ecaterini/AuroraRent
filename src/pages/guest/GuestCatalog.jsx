
import { useMemo, useState } from "react";
import "../../App.css";

const initialEquipment = [
  {
    id: 1,
    name: "Перфоратор Bosch GBH 2-26",
    manufacturer: "Bosch",
    type: "Електроінструмент",
    description: "Професійний перфоратор для будівельних та монтажних робіт.",
    characteristics: ["Потужність: 800 Вт", "Вага: 2,5 кг"],
    quantity: 1,
    price: 350,
    image: "🔨",
  },
  {
    id: 2,
    name: "Шуруповерт Makita DDF482",
    manufacturer: "Makita",
    type: "Електроінструмент",
    description: "Акумуляторний шуруповерт для монтажних і ремонтних робіт.",
    characteristics: ["Напруга: 18 В", "Тип: акумуляторний"],
    quantity: 3,
    price: 250,
    image: "🔧",
  },
  {
    id: 3,
    name: "Будівельна драбина",
    manufacturer: "DeWalt",
    type: "Будівельне обладнання",
    description: "Міцна алюмінієва драбина для робіт на висоті.",
    characteristics: ["Матеріал: алюміній", "Вага: 6 кг"],
    quantity: 5,
    price: 150,
    image: "🪜",
  },
];

function GuestCatalog({ onLogout }) {
  const [equipment] = useState(initialEquipment);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("Усі категорії");

  const categories = [
    "Усі категорії",
    ...new Set(equipment.map((item) => item.type)),
  ];

  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const matchesSearch = `${item.name} ${item.manufacturer}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesType =
        selectedType === "Усі категорії" ||
        item.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [equipment, search, selectedType]);

  const handleRent = (item) => {
    window.alert(
      `Для оформлення оренди "${item.name}" зверніться до менеджера.`
    );
  };

  return (
    <div className="guest-page">
      <header className="guest-header">
        <div className="guest-logo">
          <div className="guest-logo-icon">A</div>
          <span>AuroraRent</span>
        </div>

        <div className="guest-header-right">
          <span className="guest-role-label">Гостьовий доступ</span>

          <button className="guest-logout" onClick={onLogout}>
            Вийти <span>↗</span>
          </button>
        </div>
      </header>

      <main className="guest-content">
        <section className="guest-hero">
          <div className="guest-hero-content">
            <span className="guest-eyebrow">AURORARENT / КАТАЛОГ</span>

            <h1>
              Обладнання
              <br />
              для ваших завдань
            </h1>

            <p>
              Переглядайте доступне обладнання та обирайте
              необхідні інструменти для роботи.
            </p>

            <a href="#guest-equipment" className="guest-hero-button">
              Переглянути каталог <span>↓</span>
            </a>
          </div>

          <div className="guest-hero-decoration">
            <div className="guest-decoration-circle"></div>
            <div className="guest-decoration-icon">⚙</div>
          </div>
        </section>

        <section className="guest-catalog" id="guest-equipment">
          <div className="guest-section-heading">
            <div>
              <span className="guest-eyebrow">НАШ АСОРТИМЕНТ</span>
              <h2>Каталог обладнання</h2>
              <p>Оберіть категорію або знайдіть потрібне обладнання</p>
            </div>

            <span className="guest-total">
              {filteredEquipment.length} позицій
            </span>
          </div>

          <div className="guest-filters">
            <div className="guest-search">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Пошук обладнання..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {filteredEquipment.length > 0 ? (
            <div className="guest-equipment-grid">
              {filteredEquipment.map((item) => (
                <article className="guest-equipment-card" key={item.id}>
                  <div className="guest-equipment-image">
                    <span>{item.image}</span>

                    <span
                      className={`guest-availability ${
                        item.quantity > 0 ? "available" : "unavailable"
                      }`}
                    >
                      {item.quantity > 0 ? "Доступно" : "Недоступно"}
                    </span>
                  </div>

                  <div className="guest-equipment-info">
                    <span className="guest-equipment-category">
                      {item.type}
                    </span>

                    <h3>{item.name}</h3>

                    <p className="guest-manufacturer">
                      Виробник: {item.manufacturer}
                    </p>

                    <p className="guest-description">
                      {item.description}
                    </p>

                    <div className="guest-characteristics">
                      {item.characteristics.map((characteristic) => (
                        <span key={characteristic}>
                          {characteristic}
                        </span>
                      ))}
                    </div>

                    <div className="guest-equipment-bottom">
                      <div>
                        <strong>
                          {item.price.toLocaleString("uk-UA")} грн
                        </strong>
                        <span>за добу</span>
                      </div>

                      <span className="guest-quantity">
                        Кількість: {item.quantity}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="guest-rent-button"
                      disabled={item.quantity <= 0}
                      onClick={() => handleRent(item)}
                    >
                      Орендувати <span>→</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="guest-empty">
              За вашим запитом обладнання не знайдено.
            </div>
          )}
        </section>
      </main>

      <footer className="guest-footer">
        <div className="guest-logo">
          <div className="guest-logo-icon">A</div>
          <span>AuroraRent</span>
        </div>

        <span>© 2026 AuroraRent. Усі права захищені.</span>
      </footer>
    </div>
  );
}

export default GuestCatalog;
