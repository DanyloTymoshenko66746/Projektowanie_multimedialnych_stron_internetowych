
function toggleTheme() {
    const link = document.querySelector('link[rel="stylesheet"]');

    if (link.getAttribute("href") === "red.css") {
        link.setAttribute("href", "green.css");
    } else {
        link.setAttribute("href", "red.css");
    }
}


function toggleSection() {
    const section = document.getElementById("projekty");
    if (section.style.display === "none") {
        section.style.display = "block";
    } else {
        section.style.display = "none";
    }
}


function loadDataFromJSON() {
    fetch("data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Błąd ładowania danych");
            }
            return response.json();
        })
        .then(data => {
           
            const skillsList = document.getElementById("skillsList");
            if (skillsList) {
                skillsList.innerHTML = ""; 
                data.skills.forEach(skill => {
                    const li = document.createElement("li");
                    li.textContent = skill;
                    skillsList.appendChild(li);
                });
            }

       
            const projectsList = document.getElementById("projectsList");
            if (projectsList) {
                projectsList.innerHTML = ""; 
                data.projects.forEach(project => {
                    const li = document.createElement("li");
                    li.textContent = project;
                    projectsList.appendChild(li);
                });
            }
        })
        .catch(error => {
            console.error("Błąd ładowania JSON:", error);
            const skillsList = document.getElementById("skillsList");
            if (skillsList) {
                skillsList.innerHTML = "<li> Błąd ładowania umiejętności</li>";
            }
            const projectsList = document.getElementById("projectsList");
            if (projectsList) {
                projectsList.innerHTML = "<li> Błąd ładowania projektów</li>";
            }
        });
}


const STORAGE_KEY = "moje_notatki";

function getNotesFromStorage() {
    const notesJSON = localStorage.getItem(STORAGE_KEY);
    if (notesJSON) {
        return JSON.parse(notesJSON);
    }
    return []; 
}

function saveNotesToStorage(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function renderNotes() {
    const notesList = document.getElementById("notesList");
    const notes = getNotesFromStorage();
    
    if (!notesList) return;
    
    if (notes.length === 0) {
        notesList.innerHTML = '<li style="color: gray;">📭 Brak notatek. Dodaj pierwszą!</li>';
        return;
    }
    
    notesList.innerHTML = "";
    notes.forEach((note, index) => {
        const li = document.createElement("li");
        li.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f9f9f9;
            padding: 10px 15px;
            margin-bottom: 8px;
            border-radius: 8px;
            border-left: 4px solid var(--accent);
        `;
        
        const noteText = document.createElement("span");
        noteText.textContent = note;
        noteText.style.flex = "1";
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = " Usuń";
        deleteBtn.style.cssText = `
            background-color: #e74c3c;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px 12px;
            cursor: pointer;
            font-size: 0.8rem;
        `;
        
        deleteBtn.addEventListener("click", function() {
            deleteNote(index);
        });
        
        li.appendChild(noteText);
        li.appendChild(deleteBtn);
        notesList.appendChild(li);
    });
}

function addNote() {
    const input = document.getElementById("noteInput");
    const noteText = input.value.trim();
    
    if (noteText === "") {
        alert("Proszę wpisać treść notatki!");
        return;
    }
    
    const notes = getNotesFromStorage();
    notes.push(noteText);
    saveNotesToStorage(notes);  
    renderNotes();
    input.value = "";
    
    console.log(` Dodano notatkę: "${noteText}"`);
}

function deleteNote(index) {
    const notes = getNotesFromStorage();
    
    if (index >= 0 && index < notes.length) {
        const removedNote = notes[index];
        notes.splice(index, 1);
        saveNotesToStorage(notes);
        renderNotes();
        console.log(` Usunięto notatkę: "${removedNote}"`);
    }
}

function showStorageInfo() {
    const notes = getNotesFromStorage();
    console.log(` Local Storage - przechowujesz ${notes.length} notatek:`);
    notes.forEach((note, i) => {
        console.log(`  ${i + 1}. ${note}`);
    });
}


function sendFormToBackend(formData, formElement) {
    ////////////////// CHANGE FOR LOCAL OR RENDER /////////////////////

    //const API_URL = 'http://localhost:3000/api/contact';
    
    const API_URL = 'https://projektowanie-multimedialnych-stron.onrender.com/api/contact';

    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert(` ${data.message}\n\nDziękujemy ${formData.firstName}! Twoja wiadomość została zapisana.`);
            formElement.reset();
            return true;
        } else {
            alert(` Błąd: ${data.error}`);
            return false;
        }
    })
    .catch(error => {
        console.error(' Błąd wysyłania do backendu:', error);
        alert(' Nie udało się połączyć z serwerem. Upewnij się, że backend działa na http://localhost:3000');
        return false;
    });
}


document.addEventListener("DOMContentLoaded", function() {

    loadDataFromJSON();
    
   
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();

            let isValid = true;

            const firstName = document.getElementById("firstName");
            const lastName = document.getElementById("lastName");
            const email = document.getElementById("email");
            const message = document.getElementById("message");

            const firstNameError = document.getElementById("firstNameError");
            const lastNameError = document.getElementById("lastNameError");
            const emailError = document.getElementById("emailError");
            const messageError = document.getElementById("messageError");

        
            firstNameError.textContent = "";
            lastNameError.textContent = "";
            emailError.textContent = "";
            messageError.textContent = "";

            const nameRegex = /^[A-Za-zÀ-ž]+$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          
            if (firstName.value.trim() === "") {
                firstNameError.textContent = "Imię jest wymagane";
                isValid = false;
            } else if (!nameRegex.test(firstName.value)) {
                firstNameError.textContent = "Imię nie może zawierać cyfr";
                isValid = false;
            }

            if (lastName.value.trim() === "") {
                lastNameError.textContent = "Nazwisko jest wymagane";
                isValid = false;
            } else if (!nameRegex.test(lastName.value)) {
                lastNameError.textContent = "Nazwisko nie może zawierać cyfr";
                isValid = false;
            }

            if (email.value.trim() === "") {
                emailError.textContent = "Email jest wymagany";
                isValid = false;
            } else if (!emailRegex.test(email.value)) {
                emailError.textContent = "Niepoprawny email";
                isValid = false;
            }

            if (message.value.trim() === "") {
                messageError.textContent = "Wiadomość jest wymagana";
                isValid = false;
            }

            if (isValid) {
                const formData = {
                    firstName: firstName.value.trim(),
                    lastName: lastName.value.trim(),
                    email: email.value.trim(),
                    message: message.value.trim()
                };
                
                sendFormToBackend(formData, contactForm);
            }
        });
    } else {
        console.warn("Formularz #contactForm nie znaleziony na stronie");
    }
    
 
    renderNotes();
    showStorageInfo();
    
    const addBtn = document.getElementById("addNoteBtn");
    if (addBtn) {
        addBtn.addEventListener("click", addNote);
    } else {
        console.warn("Przycisk #addNoteBtn nie znaleziony");
    }
    
    const noteInput = document.getElementById("noteInput");
    if (noteInput) {
        noteInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                addNote();
            }
        });
    }
});