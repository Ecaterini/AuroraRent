import { useState } from "react";
import "../../App.css";

function Directories({
  onBack,
  directories,
  setDirectories,
  deletedValues,
  setDeletedValues,
}) {
  const [selectedType, setSelectedType] = useState("Виробник");
  const [newValue, setNewValue] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [message, setMessage] = useState("");

  const values = directories[selectedType];

  const handleSave = (event) => {
    event.preventDefault();

    const trimmedValue = newValue.trim();

    if (!trimmedValue) {
      setMessage("Введіть назву довідникового значення.");
      return;
    }

    setDirectories((prev) => ({
      ...prev,
      [selectedType]:
        editingIndex === null
          ? [...prev[selectedType], trimmedValue]
          : prev[selectedType].map((value, index) =>
              index === editingIndex ? trimmedValue : value
            ),
    }));

    setMessage(
      editingIndex === null
        ? "Значення успішно додано."
        : "Значення успішно змінено."
    );

    setNewValue("");
    setEditingIndex(null);
  };

  const handleEdit = (index) => {
    setNewValue(values[index]);
    setEditingIndex(index);
    setMessage("");
  };

  const handleDelete = (index) => {
    const confirmed = window.confirm(
      "Ви дійсно хочете позначити це значення як видалене?"
    );

    if (!confirmed) return;

    const key = `${selectedType}-${index}`;

    setDeletedValues((prev) => ({
      ...prev,
      [key]: true,
    }));

    if (editingIndex === index) {
      setNewValue("");
      setEditingIndex(null);
    }

    setMessage("Значення позначено як видалене.");
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setNewValue("");
    setEditingIndex(null);
    setMessage("");
  };

  const handleCancelEdit = () => {
    setNewValue("");
    setEditingIndex(null);
    setMessage("");
  };

  return (
    <main className="directory-page">
      <div className="directory-heading">
        <div>
          <span className="welcome-label">
            AURORARENT / ДОВІДНИКИ
          </span>

          <h1>Ведення довідників</h1>

          <p>Перегляд та управління довідниковими значеннями</p>
        </div>

        <button className="back-button" onClick={onBack}>
          ← Назад
        </button>
      </div>

      <section className="directory-panel">
        <h2>Тип довідника</h2>

        <div className="directory-types">
          {Object.keys(directories).map((type) => (
            <button
              key={type}
              className={`directory-type ${
                selectedType === type ? "selected" : ""
              }`}
              onClick={() => handleTypeChange(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="directory-list-heading">
          <div>
            <h2>{selectedType}</h2>
            <p>Збережені значення довідника</p>
          </div>
        </div>

        {values.length > 0 ? (
          <div className="directory-values">
            {values.map((value, index) => {
              const isDeleted = deletedValues[`${selectedType}-${index}`];

              return (
                <div
                  className={`directory-value ${
                    isDeleted ? "directory-value-deleted" : ""
                  }`}
                  key={`${value}-${index}`}
                >
                  <div>
                    <span>{value}</span>

                    {isDeleted && (
                      <span className="directory-deleted-label">
                        Видалено
                      </span>
                    )}
                  </div>

                  {!isDeleted && (
                    <div className="directory-item-actions">
                      <button
                        type="button"
                        className="directory-edit-button"
                        onClick={() => handleEdit(index)}
                      >
                        Редагувати
                      </button>

                      <button
                        type="button"
                        className="directory-delete-button"
                        onClick={() => handleDelete(index)}
                      >
                        Видалити
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="directory-empty">
            У довіднику поки немає збережених значень
          </div>
        )}

        <form className="directory-add-form" onSubmit={handleSave}>
          <label htmlFor="new-directory-value">
            {editingIndex === null
              ? "Додати нове значення"
              : "Редагувати значення"}
          </label>

          <div className="directory-add-controls">
            <input
              id="new-directory-value"
              type="text"
              value={newValue}
              onChange={(event) => {
                setNewValue(event.target.value);
                setMessage("");
              }}
              placeholder="Введіть назву..."
            />

            <button type="submit">
              {editingIndex === null ? "+ Додати" : "Зберегти зміни"}
            </button>

            {editingIndex !== null && (
              <button
                type="button"
                className="directory-cancel-button"
                onClick={handleCancelEdit}
              >
                Скасувати
              </button>
            )}
          </div>

          {message && (
            <p className="directory-message">{message}</p>
          )}
        </form>
      </section>
    </main>
  );
}

export default Directories;