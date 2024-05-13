import { useState } from 'react'
import './App.css'
import { PersonForm } from './PersonForm'

function App() {
	const [isFormVisible, setIsFormVisible] = useState(false)
	const [currentUser, setCurrentUser] = useState({
		id: '',
		fullName: '',
		birthdate: '',
		hobbies: '',
		gender: '',
		image: null,
	})

	const [users, setUsers] = useState([])

	const addUser = (user) => {
		setUsers([...users, user])
	}

	const deleteUser = (userId) => {
		const usersNew = users.filter((user) => user.id !== userId)
		setUsers(usersNew)
	}

	const editUser = (userToEdit) => {
		setUsers((prevUsers) =>
			prevUsers.map((user) =>
				user.id === userToEdit.id ? userToEdit : user
			)
		)
	}

	return (
		<>
			<div className='container'>
				<button
					style={{ margin: '50px 0' }}
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
									<button
										onClick={(e) => {
											e.preventDefault()
											setCurrentUser({
												...user,
												hobbies: user.hobbies.join(),
											})
											setIsFormVisible(true)
										}}
										style={{ marginRight: 15 }}
									>
										Редактировать
									</button>
									<button
										onClick={(e) => {
											e.preventDefault()
											deleteUser(user.id)
										}}
									>
										Удалить
									</button>
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
				editUser={editUser}
				currentUser={currentUser}
				setCurrentUser={setCurrentUser}
			/>
		</>
	)
}

export default App
