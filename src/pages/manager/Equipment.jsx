import { useState } from "react";
import "../../App.css";

function getTodayDate() {
  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().split("T")[0];
}

function Equipment({
  onBack,
  directories,
  setDirectories,
  deletedValues,
  equipment,
  setEquipment,
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [writingOffId, setWritingOffId] = useState(null);
  const [writeOffDate, setWriteOffDate] = useState(getTodayDate());
  const [writeOffQuantity, setWriteOffQuantity] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    description: "",
    type: "",
    accounting: "Фізичні одиниці",
    quantity: 1,
    purchaseDate: "",
    supplier: "",
    price: "",
  });

  const [characteristics, setCharacteristics] = useState([]);
  const [selectedCharacteristic, setSelectedCharacteristic] =
    useState("");
  const [characteristicValue, setCharacteristicValue] = useState("");

  const activeManufacturers = directories["Виробник"].filter(
    (value, index) => !deletedValues[`Виробник-${index}`]
  );

  const activeSuppliers = directories["Постачальник"].filter(
    (value, index) => !deletedValues[`Постачальник-${index}`]
  );

  const activeTypes = directories["Тип обладнання"].filter(
    (value, index) => !deletedValues[`Тип обладнання-${index}`]
  );

  const activeCharacteristics = directories["Характеристика"].filter(
    (value, index) => !deletedValues[`Характеристика-${index}`]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDirectorySelect = (
    event,
    directoryType,
    fieldName
  ) => {
    const selectedValue = event.target.value;

    if (selectedValue === "add_new") {
      const newDirectoryValue = window.prompt(
        "Введіть нове значення довідника:"
      );

      if (!newDirectoryValue || !newDirectoryValue.trim()) {
        return;
      }

      const trimmedValue = newDirectoryValue.trim();

      if (directories[directoryType].includes(trimmedValue)) {
        window.alert("Таке значення вже існує в довіднику.");
        return;
      }

      setDirectories((prev) => ({
        ...prev,
        [directoryType]: [
          ...prev[directoryType],
          trimmedValue,
        ],
      }));

      if (fieldName) {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: trimmedValue,
        }));
      } else {
        setSelectedCharacteristic(trimmedValue);
      }

      return;
    }

    if (fieldName) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: selectedValue,
      }));
    } else {
      setSelectedCharacteristic(selectedValue);
    }
  };

  const handleAddCharacteristic = () => {
    if (!selectedCharacteristic || !characteristicValue.trim()) {
      return;
    }

    setCharacteristics((prev) => [
      ...prev,
      {
        name: selectedCharacteristic,
        value: characteristicValue.trim(),
      },
    ]);

    setSelectedCharacteristic("");
    setCharacteristicValue("");
  };

  const handleRemoveCharacteristic = (index) => {
    setCharacteristics((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const resetForm = () => {
    setFormData({
      name: "",
      manufacturer: "",
      description: "",
      type: "",
      accounting: "Фізичні одиниці",
      quantity: 1,
      purchaseDate: "",
      supplier: "",
      price: "",
    });

    setCharacteristics([]);
    setSelectedCharacteristic("");
    setCharacteristicValue("");
    setEditingId(null);
  };

  const handleEditEquipment = (item) => {
    setEditingId(item.id);

    setFormData({
      name: item.name,
      manufacturer: item.manufacturer,
      description: item.description,
      type: item.type,
      accounting: item.accounting,
      quantity: item.quantity,
      purchaseDate: item.purchaseDate,
      supplier: item.supplier,
      price: item.price,
    });

    setCharacteristics([...item.characteristics]);
    setSelectedCharacteristic("");
    setCharacteristicValue("");
    setShowForm(true);
  };

  const handleSaveEquipment = (event) => {
    event.preventDefault();

    const existingItem = equipment.find(
      (item) => item.id === editingId
    );

    const updatedItem = {
      ...existingItem,
      ...formData,
      id: editingId ?? Date.now(),
      quantity:
        formData.accounting === "За кількістю"
          ? Number(formData.quantity)
          : editingId !== null
            ? existingItem.quantity
            : 1,
      price: Number(formData.price),
      characteristics: [...characteristics],
    };

    if (editingId !== null) {
      setEquipment((prev) =>
        prev.map((item) =>
          item.id === editingId ? updatedItem : item
        )
      );
    } else {
      setEquipment((prev) => [...prev, updatedItem]);
    }

    resetForm();
    setShowForm(false);
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  const handleShowAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleStartWriteOff = (item) => {
    setWritingOffId(item.id);
    setWriteOffDate(getTodayDate());
    setWriteOffQuantity(1);
  };

  const handleCancelWriteOff = () => {
    setWritingOffId(null);
    setWriteOffDate(getTodayDate());
    setWriteOffQuantity(1);
  };

  const handleWriteOff = (event, item) => {
    event.preventDefault();

    if (!writeOffDate) {
      window.alert("Оберіть дату списання.");
      return;
    }

    const quantityToWriteOff =
      item.accounting === "За кількістю"
        ? Number(writeOffQuantity)
        : item.quantity;

    if (
      item.accounting === "За кількістю" &&
      (
        !Number.isInteger(quantityToWriteOff) ||
        quantityToWriteOff < 1 ||
        quantityToWriteOff > item.quantity
      )
    ) {
      window.alert("Вкажіть коректну кількість для списання.");
      return;
    }

    const confirmed = window.confirm(
      `Підтвердити списання обладнання "${item.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setEquipment((prev) =>
      prev.map((equipmentItem) => {
        if (equipmentItem.id !== item.id) {
          return equipmentItem;
        }

        const remainingQuantity =
          equipmentItem.quantity - quantityToWriteOff;

        const writeOffHistory = [
          ...(equipmentItem.writeOffHistory || []),
          {
            date: writeOffDate,
            quantity: quantityToWriteOff,
          },
        ];

        return {
          ...equipmentItem,
          quantity: remainingQuantity,
          status:
            remainingQuantity === 0
              ? "Списано"
              : "Частково списано",
          writeOffHistory,
        };
      })
    );

    handleCancelWriteOff();
  };

  return (
    <main className="equipment-page">
      <div className="equipment-heading">
        <div>
          <span className="welcome-label">
            AURORARENT / ОБЛАДНАННЯ
          </span>

          <h1>Реєстрація обладнання</h1>

          <p>Перегляд та управління списком обладнання</p>
        </div>

        <button className="back-button" onClick={onBack}>
          ← Назад
        </button>
      </div>

      <section className="equipment-panel">
        <div className="equipment-list-heading">
          <div>
            <h2>Список обладнання</h2>
            <p>Зареєстроване обладнання в системі</p>
          </div>

          <div className="equipment-heading-actions">
            <span className="equipment-count">
              Усього: {equipment.length}
            </span>

            <button
              type="button"
              className="equipment-add-button"
              onClick={handleShowAddForm}
            >
              + Додати обладнання
            </button>
          </div>
        </div>

        {showForm && (
          <form
            className="equipment-form"
            onSubmit={handleSaveEquipment}
          >
            <div className="equipment-form-heading">
              <h2>
                {editingId !== null
                  ? "Редагування обладнання"
                  : "Нове обладнання"}
              </h2>

              <p>
                {editingId !== null
                  ? "Внесіть необхідні зміни до даних обладнання"
                  : "Заповніть основну інформацію про обладнання"}
              </p>
            </div>

            <div className="equipment-form-grid">
              <div className="equipment-field">
                <label htmlFor="equipment-name">
                  Назва обладнання *
                </label>

                <input
                  id="equipment-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Введіть назву обладнання"
                  required
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="equipment-manufacturer">
                  Виробник *
                </label>

                <select
                  id="equipment-manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={(event) =>
                    handleDirectorySelect(
                      event,
                      "Виробник",
                      "manufacturer"
                    )
                  }
                  required
                >
                  <option value="">Оберіть виробника</option>

                  {formData.manufacturer &&
                    !activeManufacturers.includes(formData.manufacturer) && (
                      <option value={formData.manufacturer}>
                        {formData.manufacturer}
                      </option>
                    )}

                  {activeManufacturers.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}

                  <option value="add_new">
                    + Додати нового виробника
                  </option>
                </select>
              </div>

              <div className="equipment-field">
                <label htmlFor="equipment-type">
                  Тип обладнання *
                </label>

                <select
                  id="equipment-type"
                  name="type"
                  value={formData.type}
                  onChange={(event) =>
                    handleDirectorySelect(
                      event,
                      "Тип обладнання",
                      "type"
                    )
                  }
                  required
                >
                  <option value="">Оберіть тип</option>

                  {formData.type &&
                    !activeTypes.includes(formData.type) && (
                      <option value={formData.type}>
                        {formData.type}
                      </option>
                    )}

                  {activeTypes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}

                  <option value="add_new">
                    + Додати новий тип
                  </option>
                </select>
              </div>

              <div className="equipment-field">
                <label htmlFor="equipment-supplier">
                  Постачальник *
                </label>

                <select
                  id="equipment-supplier"
                  name="supplier"
                  value={formData.supplier}
                  onChange={(event) =>
                    handleDirectorySelect(
                      event,
                      "Постачальник",
                      "supplier"
                    )
                  }
                  required
                >
                  <option value="">Оберіть постачальника</option>

                  {formData.supplier &&
                    !activeSuppliers.includes(formData.supplier) && (
                      <option value={formData.supplier}>
                        {formData.supplier}
                      </option>
                    )}

                  {activeSuppliers.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}

                  <option value="add_new">
                    + Додати нового постачальника
                  </option>
                </select>
              </div>

              <div className="equipment-field equipment-field-full">
                <label htmlFor="equipment-description">
                  Опис обладнання
                </label>

                <textarea
                  id="equipment-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Введіть опис обладнання..."
                  rows="3"
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="equipment-accounting">
                  Спосіб обліку *
                </label>

                <select
                  id="equipment-accounting"
                  name="accounting"
                  value={formData.accounting}
                  onChange={handleChange}
                  required
                >
                  <option value="Фізичні одиниці">
                    Фізичні одиниці
                  </option>

                  <option value="За кількістю">
                    За кількістю
                  </option>
                </select>
              </div>

              {formData.accounting === "За кількістю" && (
                <div className="equipment-field">
                  <label htmlFor="equipment-quantity">
                    Кількість *
                  </label>

                  <input
                    id="equipment-quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="equipment-field">
                <label htmlFor="equipment-date">
                  Дата закупівлі *
                </label>

                <input
                  id="equipment-date"
                  name="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="equipment-price">
                  Вартість закупівлі *
                </label>

                <input
                  id="equipment-price"
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
            </div>

            <div className="equipment-characteristics">
              <div className="equipment-form-heading">
                <h2>Характеристики обладнання</h2>
                <p>Оберіть характеристику та вкажіть її значення</p>
              </div>

              <div className="equipment-characteristic-controls">
                <select
                  value={selectedCharacteristic}
                  onChange={(event) =>
                    handleDirectorySelect(
                      event,
                      "Характеристика",
                      null
                    )
                  }
                >
                  <option value="">
                    Оберіть характеристику
                  </option>

                  {activeCharacteristics.map((item) => (
                    <option
                      key={item}
                      value={item}
                      disabled={characteristics.some(
                        (characteristic) =>
                          characteristic.name === item
                      )}
                    >
                      {item}
                    </option>
                  ))}

                  <option value="add_new">
                    + Додати характеристику
                  </option>
                </select>

                <input
                  type="text"
                  value={characteristicValue}
                  onChange={(event) =>
                    setCharacteristicValue(event.target.value)
                  }
                  placeholder="Вкажіть значення"
                />

                <button
                  type="button"
                  className="equipment-characteristic-add"
                  onClick={handleAddCharacteristic}
                >
                  + Додати
                </button>
              </div>

              {characteristics.length > 0 && (
                <div className="equipment-characteristic-list">
                  {characteristics.map((item, index) => (
                    <div
                      className="equipment-characteristic-item"
                      key={`${item.name}-${index}`}
                    >
                      <span>
                        <strong>{item.name}:</strong> {item.value}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveCharacteristic(index)
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="equipment-form-actions">
              <button type="button" onClick={handleCancel}>
                Скасувати
              </button>

              <button type="submit">
                {editingId !== null
                  ? "Зберегти зміни"
                  : "Зберегти обладнання"}
              </button>
            </div>
          </form>
        )}

        {equipment.length > 0 ? (
          <div className="equipment-table-wrapper">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>Назва обладнання</th>
                  <th>Виробник</th>
                  <th>Тип обладнання</th>
                  <th>Спосіб обліку</th>
                  <th>Кількість</th>
                  <th>Статус</th>
                  <th>Дії</th>
                </tr>
              </thead>

              <tbody>
                {equipment.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.manufacturer}</td>
                    <td>{item.type}</td>
                    <td>{item.accounting}</td>
                    <td>{item.quantity}</td>
                    <td>{item.status || "Доступне"}</td>
                    <td>
                      <div className="directory-item-actions">
                        <button
                          type="button"
                          className="directory-edit-button"
                          onClick={() => handleEditEquipment(item)}
                        >
                          Редагувати
                        </button>

                        {item.status !== "Списано" && (
                          <button
                            type="button"
                            className="directory-delete-button"
                            onClick={() => handleStartWriteOff(item)}
                          >
                            Списати
                          </button>
                        )}
                      </div>

                      {writingOffId === item.id && (
                        <form
                          className="equipment-form"
                          onSubmit={(event) =>
                            handleWriteOff(event, item)
                          }
                        >
                          <div className="equipment-field">
                            <label htmlFor={`writeoff-date-${item.id}`}>
                              Дата списання *
                            </label>

                            <input
                              id={`writeoff-date-${item.id}`}
                              type="date"
                              value={writeOffDate}
                              onChange={(event) =>
                                setWriteOffDate(event.target.value)
                              }
                              required
                            />
                          </div>

                          {item.accounting === "За кількістю" && (
                            <div className="equipment-field">
                              <label htmlFor={`writeoff-quantity-${item.id}`}>
                                Кількість для списання *
                              </label>

                              <input
                                id={`writeoff-quantity-${item.id}`}
                                type="number"
                                min="1"
                                max={item.quantity}
                                step="1"
                                value={writeOffQuantity}
                                onChange={(event) =>
                                  setWriteOffQuantity(event.target.value)
                                }
                                required
                              />

                              <small>
                                Доступна кількість: {item.quantity}
                              </small>
                            </div>
                          )}

                          {item.accounting === "Фізичні одиниці" && (
                            <p>
                              Буде списано всю одиницю обладнання.
                            </p>
                          )}

                          <div className="equipment-form-actions">
                            <button
                              type="button"
                              onClick={handleCancelWriteOff}
                            >
                              Скасувати
                            </button>

                            <button type="submit">
                              Підтвердити списання
                            </button>
                          </div>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="equipment-empty">
            У системі поки немає збереженого обладнання.
          </div>
        )}
      </section>
    </main>
  );
}

export default Equipment;