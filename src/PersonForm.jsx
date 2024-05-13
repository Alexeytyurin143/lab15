import jsPDF from 'jspdf'
import { useRef, useState } from 'react'

export const PersonForm = ({
	isFormVisible,
	setIsFormVisible,
	addUser,
	editUser,
	setCurrentUser,
	currentUser,
}) => {
	const [currentId, setCurrentId] = useState(1)
	const videoRef = useRef(null)
	const [mediaStream, setMediaStream] = useState(null)

	const { id, fullName, birthdate, hobbies, gender, image } = currentUser

	const startVideo = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
			})
			setMediaStream(stream)
			if (videoRef.current) {
				videoRef.current.srcObject = stream
			}
		} catch (err) {
			console.error('Error accessing webcam:', err)
		}
	}

	const captureImage = () => {
		if (videoRef.current) {
			const canvas = document.createElement('canvas')
			canvas.width = videoRef.current.videoWidth
			canvas.height = videoRef.current.videoHeight
			const context = canvas.getContext('2d')
			context.drawImage(
				videoRef.current,
				0,
				0,
				canvas.width,
				canvas.height
			)

			const dataURL = canvas.toDataURL('image/png')

			setCurrentUser({ ...currentUser, image: dataURL })

			mediaStream.getTracks().forEach((track) => track.stop())
		}
	}

	const retakeImage = () => {
		setCurrentUser({ ...currentUser, image: null })
		startVideo()
	}

	const exportToJson = (e) => {
		e.preventDefault()
		const personData = {
			fullName,
			birthdate,
			hobbies: hobbies.split(',').map((hobby) => hobby.trim()),
		}
		const jsonData = JSON.stringify(personData, null, 2)
		const blob = new Blob([jsonData], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = 'personData.json'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}

	const exportToPdf = (e) => {
		e.preventDefault()
		const doc = new jsPDF()
		doc.text(`Full name: ${fullName}`, 10, 10)
		doc.text(`Date of birth: ${birthdate}`, 10, 20)
		doc.text(`Gender: ${gender}`, 10, 30)
		doc.text(`Hobbies: ${hobbies}`, 10, 40)
		if (image) {
			const img = new Image()
			img.src = image
			img.onload = function () {
				const canvas = document.createElement('canvas')
				const ctx = canvas.getContext('2d')
				canvas.width = this.width
				canvas.height = this.height
				ctx.drawImage(this, 0, 0)
				const dataUrl = canvas.toDataURL('image/jpeg')
				doc.addImage(dataUrl, 'JPEG', 10, 50, 100, 75)
				doc.save('personData.pdf')
			}
		} else {
			doc.save('personData.pdf')
		}
	}

	const handleAddUser = (e) => {
		e.preventDefault()
		const personData = {
			id: currentId,
			fullName,
			birthdate,
			gender,
			hobbies: hobbies.split(',').map((hobby) => hobby.trim()),
			image,
		}
		addUser(personData)
		setCurrentId(currentId + 1)
		setCurrentUser({
			id: '',
			fullName: '',
			birthdate: '',
			hobbies: '',
			gender: '',
			image: null,
		})
		setMediaStream(null)

		setIsFormVisible(false)
	}

	const handleEditUser = (e) => {
		e.preventDefault()
		const personData = {
			id,
			fullName,
			birthdate,
			gender,
			hobbies: hobbies.split(',').map((hobby) => hobby.trim()),
			image,
		}
		editUser(personData)
		setCurrentUser({
			id: '',
			fullName: '',
			birthdate: '',
			hobbies: '',
			gender: '',
			image: null,
		})

		setIsFormVisible(false)
	}

	if (!isFormVisible) {
		return
	}

	return (
		<div className='personFormWrapper'>
			<form className='personForm' id='personForm'>
				<label>
					ФИО
					<input
						type='text'
						placeholder='ФИО'
						value={fullName}
						onChange={(e) =>
							setCurrentUser({
								...currentUser,
								fullName: e.target.value,
							})
						}
					/>
				</label>

				<label>
					Дата рождения
					<input
						type='date'
						placeholder='Дата рождения'
						value={birthdate}
						onChange={(e) =>
							setCurrentUser({
								...currentUser,
								birthdate: e.target.value,
							})
						}
					/>
				</label>

				<fieldset>
					<legend>Выберите пол</legend>
					<div>
						<label>
							<input
								checked={gender === 'male'}
								type='radio'
								value='male'
								name='gender'
								onChange={(e) =>
									setCurrentUser({
										...currentUser,
										gender: e.target.value,
									})
								}
							/>
							Мужской
						</label>
						<label>
							<input
								checked={gender === 'female'}
								type='radio'
								value='female'
								name='gender'
								onChange={(e) =>
									setCurrentUser({
										...currentUser,
										gender: e.target.value,
									})
								}
							/>
							Женский
						</label>
					</div>
				</fieldset>

				<label>
					Увлечения
					<input
						type='text'
						placeholder='Увлечения (через запятую)'
						value={hobbies}
						onChange={(e) =>
							setCurrentUser({
								...currentUser,
								hobbies: e.target.value,
							})
						}
					/>
				</label>
				<div>
					{image ? (
						<div>
							<img
								style={{ width: '90%', marginBottom: 15 }}
								src={image}
								alt='Captured'
							/>
							<button
								onClick={(e) => {
									e.preventDefault()
									retakeImage()
								}}
							>
								Переснять
							</button>
						</div>
					) : (
						<video
							style={{ width: '90%', marginBottom: 15 }}
							ref={videoRef}
							autoPlay
						></video>
					)}
					{!image && (
						<button
							style={{ marginRight: 15 }}
							onClick={(e) => {
								e.preventDefault()
								startVideo()
							}}
						>
							Включить камеру
						</button>
					)}
					{mediaStream && !image && (
						<button
							onClick={(e) => {
								e.preventDefault()
								captureImage()
							}}
						>
							Сделать фото
						</button>
					)}
				</div>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						gap: 15,
						flexWrap: 'wrap',
					}}
				>
					<button style={{ width: '50%' }} onClick={exportToJson}>
						Экспорт в JSON
					</button>
					<button style={{ width: '45%' }} onClick={exportToPdf}>
						Экспорт в PDF
					</button>
					{!currentUser.id ? (
						<button
							style={{ width: '50%' }}
							onClick={handleAddUser}
						>
							Добавить в список
						</button>
					) : (
						<button
							style={{ width: '50%' }}
							onClick={handleEditUser}
						>
							Сохранить
						</button>
					)}

					<button
						style={{ width: '45%' }}
						onClick={(e) => {
							e.preventDefault()
							setIsFormVisible(false)
							setCurrentUser({
								id: '',
								fullName: '',
								birthdate: '',
								hobbies: '',
								gender: '',
								image: null,
							})
							setMediaStream(null)
						}}
					>
						Отмена
					</button>
				</div>
			</form>
		</div>
	)
}
