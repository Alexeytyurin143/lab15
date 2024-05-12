import { useState } from "react";

export const PersonForm = ({ isFormVisible, setIsFormVisible, addUser }) => {
  const [fullName, setFullName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [gender, setGender] = useState("");
  const [photo, setPhoto] = useState(null);
  const [currentId, setCurrentId] = useState(1);

  const capturePhoto = async (e) => {
    e.preventDefault();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      videoElement.play();
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setPhoto(dataUrl);
      stream.getVideoTracks()[0].stop();
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  };

  const exportToJson = () => {
    const personData = {
      fullName,
      birthdate,
      hobbies: hobbies.split(",").map((hobby) => hobby.trim()),
    };
    const jsonData = JSON.stringify(personData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "personData.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToPdf = () => {
    const personData = `Full Name: ${fullName}\nBirthdate: ${birthdate}\nHobbies: ${hobbies}`;
    const pdfContent = `
      <html>
        <head>
          <title>Person Data</title>
        </head>
        <body>
          <pre>${personData}</pre>
        </body>
      </html>
    `;
    const blob = new Blob([pdfContent], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "personData.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isFormVisible) {
    return;
  }

  const handleAddUser = (e) => {
    e.preventDefault();
    const personData = {
      id: currentId,
      fullName,
      birthdate,
      gender,
      hobbies: hobbies.split(",").map((hobby) => hobby.trim()),
    };
    addUser(personData);
    setCurrentId(currentId + 1);
    setFullName("");
    setBirthdate("");
    setHobbies("");
    setGender("");
    setPhoto("");

    setIsFormVisible(false);
  };

  return (
    <div className="personFormWrapper">
      <form className="personForm" id="personForm">
        <label>
          ФИО
          <input
            type="text"
            placeholder="ФИО"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>

        <label>
          Дата рождения
          <input
            type="date"
            placeholder="Дата рождения"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
        </label>

        <fieldset>
          <legend>Выберите пол</legend>
          <div>
            <label>
              <input
                type="radio"
                value="male"
                name="gender"
                onChange={(e) => setGender(e.target.value)}
              />
              Мужской
            </label>
            <label>
              <input
                type="radio"
                value="female"
                name="gender"
                onChange={(e) => setGender(e.target.value)}
              />
              Женский
            </label>
          </div>
        </fieldset>

        <label>
          Увлечения
          <input
            type="text"
            placeholder="Увлечения (через запятую)"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
          />
        </label>
        {photo && <img src={photo} alt="Person" />}
        <button onClick={capturePhoto}>Сделать фото</button>
        <button onClick={exportToJson}>Экспорт в JSON</button>
        <button onClick={exportToPdf}>Экспорт в PDF</button>
        <button onClick={handleAddUser}>Добавить в список</button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFormVisible(false);
          }}
        >
          Отмена
        </button>
      </form>
    </div>
  );
};
