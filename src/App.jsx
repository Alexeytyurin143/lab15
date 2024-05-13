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

	const exportJSON = (e) => {
		e.preventDefault()
		const jsonData = JSON.stringify(users)

		const blob = new Blob([jsonData], { type: 'application/json' })
		const url = URL.createObjectURL(blob)

		const a = document.createElement('a')
		a.href = url
		a.download = 'data.json'
		document.body.appendChild(a)
		a.click()

		window.URL.revokeObjectURL(url)
	}

	const importJSON = (e) => {
		const file = e.target.files[0]

		if (!file) {
			alert('Please select a file.')
			return
		}

		const reader = new FileReader()
		reader.onload = function (event) {
			const jsonData = event.target.result

			try {
				setUsers(JSON.parse(jsonData))
			} catch (error) {
				alert('Error parsing JSON file: ' + error.message)
			}
		}
		reader.readAsText(file)
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
				<div
					style={{
						display: 'flex',
						gap: 15,
						marginBottom: 15,
						alignItems: 'baseline',
					}}
				>
					<h2 style={{ fontSize: 25, marginBottom: 20 }}>Список</h2>
					<button onClick={exportJSON}>Экспорт в JSON</button>
					<label className='button'>
						Импорт из JSON{' '}
						<input onChange={importJSON} type='file' hidden />
					</label>
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
