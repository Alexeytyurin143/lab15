import { useState } from "react";
import "./App.css";
import { PersonForm } from "./PersonForm";

function App() {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [users, setUsers] = useState([]);

  const addUser = (user) => {
    setUsers([...users, user]);
  };

  return (
    <>
      <div className="container">
        <button
          style={{ margin: "50px 0" }}
          onClick={() => setIsFormVisible(true)}
        >
          Добавить пользователя
        </button>
        <div>
          <h2 style={{ fontSize: 25, marginBottom: 20 }}>Список</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Дата рождения</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.birthdate}</td>
                <td>
                  <button style={{ marginRight: 15 }}>Редактировать</button>
                  <button>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PersonForm
        isFormVisible={isFormVisible}
        setIsFormVisible={setIsFormVisible}
        addUser={addUser}
      />
    </>
  );
}

export default App;
