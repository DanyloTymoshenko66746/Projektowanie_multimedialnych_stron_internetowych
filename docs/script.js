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
            // skills
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
                skillsList.innerHTML = "<li>Błąd ładowania umiejętności</li>";
            }
            const projectsList = document.getElementById("projectsList");
            if (projectsList) {
                projectsList.innerHTML = "<li>Błąd ładowania projektów</li>";
            }
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
                alert("Formularz wysłany poprawnie!");
                contactForm.reset();
            }
        });
    }
});