import { useState } from "react";
import "../../App.css";

const roles = [
  {
    name: "Адміністратор",
    description: "Повний доступ до всіх розділів системи",
  },
  {
    name: "Менеджер",
    description: "Облік обладнання, клієнтів, договорів та оренди",
  },
  {
    name: "Керівник",
    description: "Перегляд стану обладнання, оренди та звітної інформації",
  },
  {
    name: "Гість",
    description: "Перегляд доступної інформації без редагування",
  },
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "Менеджер",
};

function Users({ onBack, users, setUsers }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenForm = (user = null) => {
    if (user) {
      setEditingId(user.id);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: user.password,
        role: user.role,
      });
    } else {
      setEditingId(null);
      setFormData(emptyForm);
    }

    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedEmail = formData.email.trim().toLowerCase();

    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() === normalizedEmail &&
        user.id !== editingId
    );

    if (emailExists) {
      window.alert("Користувач із такою електронною поштою вже існує.");
      return;
    }

    const userData = {
      id: editingId ?? Date.now(),
      name: formData.name.trim(),
      email: normalizedEmail,
      phone: formData.phone.trim(),
      password: formData.password,
      role: formData.role,
      active: editingId !== null
        ? users.find((user) => user.id === editingId)?.active ?? true
        : true,
    };

    if (editingId !== null) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingId ? userData : user
        )
      );
    } else {
      setUsers((prev) => [...prev, userData]);
    }

    handleCancel();
  };

  const handleToggleStatus = (user) => {
    setUsers((prev) =>
      prev.map((item) =>
        item.id === user.id
          ? { ...item, active: !item.active }
          : item
      )
    );
  };

  const handleDelete = (user) => {
    const confirmed = window.confirm(
      `Видалити користувача "${user.name}"?`
    );

    if (!confirmed) return;

    setUsers((prev) =>
      prev.filter((item) => item.id !== user.id)
    );
  };

  return (
    <main className="equipment-page">
      <div className="equipment-heading">
        <div>
          <span className="welcome-label">
            AURORARENT / КОРИСТУВАЧІ
          </span>

          <h1>Користувачі та права</h1>

          <p>Реєстрація користувачів і розмежування прав доступу</p>
        </div>

        <button className="back-button" onClick={onBack}>
          ← Назад
        </button>
      </div>

      <section className="equipment-panel">
        <div className="equipment-list-heading">
          <div>
            <h2>Список користувачів</h2>
            <p>Облікові записи системи AuroraRent</p>
          </div>

          <div className="equipment-heading-actions">
            <span className="equipment-count">
              Усього: {users.length}
            </span>

            <button
              type="button"
              className="equipment-add-button"
              onClick={() => handleOpenForm()}
            >
              + Додати користувача
            </button>
          </div>
        </div>

        {showForm && (
          <form className="equipment-form" onSubmit={handleSubmit}>
            <div className="equipment-form-heading">
              <h2>
                {editingId !== null
                  ? "Редагування користувача"
                  : "Новий користувач"}
              </h2>

              <p>Заповніть дані та призначте роль користувачу</p>
            </div>

            <div className="equipment-form-grid">
              <div className="equipment-field">
                <label htmlFor="user-name">ПІБ користувача *</label>
                <input
                  id="user-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Введіть ПІБ"
                  required
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="user-email">Email *</label>
                <input
                  id="user-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="user-phone">Телефон *</label>
                <input
                  id="user-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+380..."
                  required
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="user-password">Пароль *</label>
                <input
                  id="user-password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Введіть пароль"
                  required
                  minLength={6}
                />
              </div>

              <div className="equipment-field">
                <label htmlFor="user-role">Роль користувача *</label>
                <select
                  id="user-role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  {roles.map((role) => (
                    <option key={role.name} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="equipment-form-actions">
              <button type="submit" className="equipment-add-button">
                {editingId !== null
                  ? "Зберегти зміни"
                  : "Зареєструвати користувача"}
              </button>

              <button
                type="button"
                className="directory-cancel-button"
                onClick={handleCancel}
              >
                Скасувати
              </button>
            </div>
          </form>
        )}

        {users.length > 0 ? (
          <div className="equipment-table-wrapper">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>ПІБ</th>
                  <th>Email</th>
                  <th>Телефон</th>
                  <th>Роль</th>
                  <th>Статус</th>
                  <th>Дії</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.active ? "Активний" : "Заблокований"}
                    </td>
                    <td>
                      <div className="directory-item-actions">
                        <button
                          type="button"
                          className="directory-edit-button"
                          onClick={() => handleOpenForm(user)}
                        >
                          Редагувати
                        </button>

                        <button
                          type="button"
                          className="directory-delete-button"
                          onClick={() => handleToggleStatus(user)}
                        >
                          {user.active ? "Заблокувати" : "Розблокувати"}
                        </button>

                        <button
                          type="button"
                          className="directory-delete-button"
                          onClick={() => handleDelete(user)}
                        >
                          Видалити
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="equipment-empty">
            Користувачів поки немає. Додайте першого користувача.
          </div>
        )}
      </section>

      <section className="equipment-panel users-roles-panel">
        <div className="equipment-list-heading">
          <div>
            <h2>Ролі та права доступу</h2>
            <p>Рівні доступу користувачів до системи</p>
          </div>
        </div>

        <div className="users-roles-grid">
          {roles.map((role) => (
            <div className="users-role-card" key={role.name}>
              <h3>{role.name}</h3>
              <p>{role.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Users;