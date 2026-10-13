// 1. Récupérer les éléments du site
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");
const registrationForm = document.getElementById("registrationForm");
const formMessage = document.getElementById("formMessage");
const birthDate = document.getElementById("birthDate");
const currentYear = document.getElementById("currentYear");

// 2. Afficher automatiquement l'année actuelle
currentYear.textContent = new Date().getFullYear();

// 3. Empêcher de choisir une date de naissance future
birthDate.max = new Date().toISOString().split("T")[0];

// 4. Ouvrir et fermer le menu sur téléphone
menuToggle.addEventListener("click", function () {
  const isOpen = navigation.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Fermer le menu" : "Ouvrir le menu"
  );

  menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Fermer le menu après avoir cliqué sur un lien
navigation.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    menuToggle.textContent = "☰";
  });
});

// 5. Vérifier et valider le formulaire
registrationForm.addEventListener("submit", function (event) {
  // Empêcher le rechargement de la page
  event.preventDefault();

  // Vérifier les champs obligatoires
  if (!registrationForm.checkValidity()) {
    registrationForm.reportValidity();
    return;
  }

  // Vérifier que la date de naissance n'est pas future
  const selectedDate = new Date(birthDate.value + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate > today) {
    formMessage.hidden = false;
    formMessage.className = "form-message error";
    formMessage.textContent =
      "La date de naissance ne peut pas être dans le futur.";

    birthDate.focus();
    return;
  }

  // Afficher un message honnête : aucune donnée n'est envoyée
  formMessage.hidden = false;
  formMessage.className = "form-message success";
  formMessage.textContent =
    "Le formulaire est valide ! Ceci est une démonstration : " +
    "votre demande n'a pas été envoyée à l'école. " +
    "Un système de réception doit être connecté pour finaliser l'inscription.";

  // Faire apparaître le message à l'écran
  formMessage.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
});

// 6. Effacer le message lorsque le formulaire est modifié
registrationForm.addEventListener("input", function () {
  formMessage.hidden = true;
});