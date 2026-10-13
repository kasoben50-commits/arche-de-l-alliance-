
const SUPABASE_URL = "https://zijiajoriigxajihbgvy.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_eJriqMQ_3dsk03JX0XpIrA_RDp22GoX";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");
const registrationForm = document.getElementById("registrationForm");
const formMessage = document.getElementById("formMessage");
const birthDate = document.getElementById("birthDate");
const currentYear = document.getElementById("currentYear");

currentYear.textContent = new Date().getFullYear();

const maintenant = new Date();
birthDate.max = [
  maintenant.getFullYear(),
  String(maintenant.getMonth() + 1).padStart(2, "0"),
  String(maintenant.getDate()).padStart(2, "0")
].join("-");

menuToggle.addEventListener("click", function () {
  const ouvert = navigation.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(ouvert));
  menuToggle.setAttribute(
    "aria-label",
    ouvert ? "Fermer le menu" : "Ouvrir le menu"
  );
  menuToggle.textContent = ouvert ? "✕" : "☰";
});

navigation.querySelectorAll("a").forEach(function (lien) {
  lien.addEventListener("click", function () {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    menuToggle.textContent = "☰";
  });
});

function afficherMessage(texte, type) {
  formMessage.hidden = false;
  formMessage.className = "form-message " + type;
  formMessage.textContent = texte;
  formMessage.scrollIntoView({ behavior: "smooth", block: "center" });
}

registrationForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  if (!registrationForm.checkValidity()) {
    registrationForm.reportValidity();
    return;
  }

  const date = birthDate.value;
  const aujourdhui = new Date();
  const dateLocale = [
    aujourdhui.getFullYear(),
    String(aujourdhui.getMonth() + 1).padStart(2, "0"),
    String(aujourdhui.getDate()).padStart(2, "0")
  ].join("-");

  if (date > dateLocale) {
    afficherMessage(
      "La date de naissance ne peut pas être dans le futur.",
      "error"
    );
    return;
  }

  const donnees = {
    nom_eleve: document.getElementById("studentName").value.trim(),
    date_naissance: date,
    sexe: document.getElementById("gender").value,
    classe_demandee: document.getElementById("classLevel").value,
    annee_scolaire: document.getElementById("schoolYear").value,
    nom_parent: document.getElementById("parentName").value.trim(),
    lien_parent: document.getElementById("relationship").value,
    telephone_parent: document.getElementById("phone").value.trim(),
    email_parent:
      document.getElementById("email").value.trim() || null,
    adresse_residence: document.getElementById("address").value.trim()
  };

  const bouton = registrationForm.querySelector(
    'button[type="submit"]'
  );

  bouton.disabled = true;
  bouton.textContent = "Envoi en cours…";

  try {
    const { error } = await supabaseClient
      .from("inscriptions")
      .insert([donnees]);

    if (error) {
      console.error("Erreur Supabase :", error);
      afficherMessage(
        "Échec de l'envoi. Vérifiez les paramètres et les permissions Supabase.",
        "error"
      );
      return;
    }

    afficherMessage(
      "Votre demande a été envoyée à l'Arche de l'Alliance. " +
      "L'admission reste à confirmer par l'école.",
      "success"
    );

    registrationForm.reset();
  } catch (erreur) {
    console.error("Erreur de connexion :", erreur);
    afficherMessage(
      "Impossible de contacter le serveur. Réessayez plus tard.",
      "error"
    );
  } finally {
    bouton.disabled = false;
    bouton.textContent = "Envoyer ma demande →";
  }
});

registrationForm.addEventListener("input", function () {
  formMessage.hidden = true;
});
