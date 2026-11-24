/* =====================================================================
   DONNÉES DE LA LIGUE : le seul fichier à modifier pour mettre le site à jour.

   Sur GitHub : ouvrez ce fichier, cliquez sur le crayon (Edit), modifiez,
   puis « Commit changes ». Le site se met à jour en une à deux minutes.

   Règles simples pour ne rien briser :
     - Gardez les guillemets "…" autour des textes.
     - Mettez une virgule entre deux éléments d'une liste.
     - Dates au format "AAAA-MM-JJ" (ex. "2026-12-06"), heures "HH:MM" (ex. "18:30").
     - Les lignes qui commencent par // sont des notes : le site les ignore.
   ===================================================================== */

window.LIGUE = {

  /* ---------- Informations générales ---------- */
  infos: {
    description: "La Ligue de Pickleball de Gracefield est née de la passion des joueurs et joueuses de notre région. Notre mission : promouvoir le pickleball, favoriser le plaisir du jeu et créer une communauté active et accueillante.",
    saison: "Hiver 2027",
    lieu: "À confirmer",
    horaire: "À confirmer",
    cotisation: "",
    courriel: "",            // ex. "ligue.pickleball.gracefield@gmail.com" : reçoit les inscriptions et les messages
    telephone: "",
    facebook: "",            // lien de la page ou du groupe Facebook (https://…)
    youtube: "",
    lienInscription: "",     // facultatif : lien d'un formulaire Google Forms ; sinon, l'inscription se fait par courriel
    lienInfolettre: ""       // facultatif : lien d'un formulaire d'abonnement ; sinon, par courriel
  },

  /* ---------- Où les joueurs se parlent ----------
     Mettez les liens que vous utilisez ; ceux laissés vides ne s'affichent pas. */
  communaute: {
    groupeFacebook: "",      // ex. "https://www.facebook.com/groups/…"
    messenger: "",           // lien d'invitation à une discussion de groupe Messenger
    whatsapp: "",            // lien d'invitation à un groupe WhatsApp (https://chat.whatsapp.com/…)
    discord: "",             // lien d'invitation Discord

    /* Forum intégré au site (facultatif) avec giscus, basé sur GitHub Discussions.
       Les joueurs doivent avoir un compte GitHub (gratuit) pour écrire.
       Voir le README, section « Forum de discussion ». */
    giscus: {
      repo: "",              // ex. "votre-nom/ligue-pickleball-gracefield"
      repoId: "",
      categorie: "",         // ex. "General"
      categorieId: ""
    }
  },

  /* ---------- Annonces (la plus récente en premier) ---------- */
  annonces: [
    { date: "2026-11-24", titre: "Bienvenue sur le site de la ligue !", texte: "Le site de la Ligue de Pickleball de Gracefield est en ligne. Consultez l'horaire et inscrivez-vous." }
  ],

  /* ---------- Horaire et tournois ----------
     type : "jeu" (soirée de jeu), "tournoi", "clinique" ou "social"
     EXEMPLES À REMPLACER par vos vraies activités. */
  evenements: [
    { date: "2026-12-06", heure: "13:00", titre: "Tournoi des Fêtes (exemple)", type: "tournoi", lieu: "", details: "Remplacez cet exemple par votre premier tournoi." },
    { date: "2027-01-12", heure: "18:30", titre: "Soirée de jeu libre (exemple)", type: "jeu", lieu: "", details: "" }
  ],

  /* ---------- Joueurs inscrits ----------
     niveau : de 2.0 (débutant) à 5.0 (expert). Les noms servent aussi au classement.
     Exemple :  { nom: "Marie Lafleur", niveau: "3.0", cherchePartenaire: true, dispo: "Mardi et jeudi soir" }, */
  joueurs: [
  ],

  /* ---------- Résultats des matchs ----------
     Le classement se calcule tout seul (2 points par victoire).
     Écrivez les noms exactement comme dans la liste des joueurs.
     Double :  { date: "2027-01-12", equipeA: ["Marie Lafleur", "Luc Gagnon"], equipeB: ["Annie Morin", "Paul Céré"], pointsA: 11, pointsB: 7 },
     Simple :  { date: "2027-01-12", equipeA: ["Marie Lafleur"], equipeB: ["Paul Céré"], pointsA: 9, pointsB: 11 }, */
  resultats: [
  ],

  /* ---------- Galerie de photos ----------
     1. Déposez la photo dans le dossier « photos » sur GitHub (Add file > Upload files).
     2. Ajoutez une ligne ici avec le nom exact du fichier.
     Exemple :  { fichier: "tournoi-des-fetes.jpg", legende: "Finale du tournoi des Fêtes" }, */
  photos: [
  ]
};
