/* Ligue de Pickleball de Gracefield : affichage du site à partir de donnees.js.
   Aucune base de données : tout le contenu vient du fichier donnees.js. */
(function () {
  "use strict";
  var D = window.LIGUE || {};
  var I = D.infos || {}, C = D.communaute || {};
  var MOIS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  var MOIS_C = ["JANV", "FÉVR", "MARS", "AVR", "MAI", "JUIN", "JUIL", "AOÛT", "SEPT", "OCT", "NOV", "DÉC"];
  var TYPES = { jeu: "Soirée de jeu", tournoi: "Tournoi", clinique: "Clinique", social: "Activité sociale" };
  var COUL = ["#A8E936", "#9CD3F5", "#F9B58F", "#F4E842", "#B9C7F5", "#8EE3C8"];

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var esc = function (v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var liste = function (x) { return Array.isArray(x) ? x : []; };
  var lienOk = function (u) { return /^https?:\/\/\S+$/i.test(u || "") ? u : ""; };
  var auj = function () { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); };
  var dateValide = function (s) { return /^\d{4}-\d{2}-\d{2}$/.test(s || ""); };
  var fDate = function (s) { if (!dateValide(s)) return ""; var p = s.split("-").map(Number); return p[2] + " " + MOIS[p[1] - 1] + " " + p[0]; };
  var fHeure = function (h) { return h ? String(h).replace(":", " h ") : ""; };
  var initiales = function (n) { return String(n || "?").trim().split(/\s+/).map(function (x) { return x[0]; }).slice(0, 2).join("").toUpperCase(); };
  var coul = function (n) { var h = 0; String(n).split("").forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) >>> 0; }); return COUL[h % COUL.length]; };
  var cle = function (n) { return String(n || "").trim().toLowerCase(); };

  var toastT;
  function toast(m) { var t = $("#toast"); t.textContent = m; t.className = "vis"; clearTimeout(toastT); toastT = setTimeout(function () { t.className = ""; }, 3600); }

  /* ---------- Navigation ---------- */
  var VUES = ["accueil", "apropos", "inscription", "tournois", "horaire", "resultats", "communaute", "galerie", "faq", "contact"];
  function route() {
    var v = (location.hash || "").slice(1); if (VUES.indexOf(v) < 0) v = "accueil";
    $$(".vue").forEach(function (s) { s.classList.toggle("active", s.id === "v-" + v); });
    $$(".nav a").forEach(function (a) { a.classList.toggle("actif", a.dataset.v === v); });
    $("#nav").classList.remove("ouvert");
    if (v === "communaute") chargerForum();
    window.scrollTo(0, 0);
  }

  /* ---------- Infos générales ---------- */
  function ligne(ic, titre, val) { return val ? '<div><svg><use href="#' + ic + '"/></svg><div><b>' + titre + "</b><br>" + esc(val) + "</div></div>" : ""; }
  function rInfos() {
    $$(".js-desc").forEach(function (p) { p.textContent = I.description || ""; });
    var fb = lienOk(I.facebook), yt = lienOk(I.youtube);
    $$(".s-fb").forEach(function (a) { if (fb) { a.href = fb; a.target = "_blank"; a.rel = "noopener"; } });
    $$(".s-yt").forEach(function (a) { if (yt) { a.href = yt; a.target = "_blank"; a.rel = "noopener"; } });
    var vide = '<div class="vide">Ces informations seront bientôt précisées.</div>';
    var pratique = ligne("i-pin", "Lieu", I.lieu) + ligne("i-horl", "Horaire habituel", I.horaire) + ligne("i-horl", "Saison", I.saison) + ligne("i-bulle", "Cotisation", I.cotisation);
    var contact = ligne("i-mail", "Courriel", I.courriel) + ligne("i-tel", "Téléphone", I.telephone);
    $("#ap-infos").innerHTML = (pratique + contact) || vide;
    $("#contact-infos").innerHTML = (contact + ligne("i-pin", "Lieu de jeu", I.lieu) + ligne("i-horl", "Horaire", I.horaire)) || vide;
    $("#horaire-hab").innerHTML = '<div class="carte-tete" style="margin:0"><h3>🕒 Horaire habituel</h3></div><p style="margin:8px 0 0;font-size:1.1rem">' + (I.horaire ? "<b>" + esc(I.horaire) + "</b>" : "À confirmer.") + (I.lieu ? " · " + esc(I.lieu) : "") + "</p>";
    $("#insc-cotisation").innerHTML = I.cotisation ? '<span class="badge lime">Cotisation : ' + esc(I.cotisation) + "</span>" : "";
    $("#faq-infos").innerHTML = [I.lieu && "<b>Lieu :</b> " + esc(I.lieu), I.horaire && "<b>Horaire :</b> " + esc(I.horaire), I.cotisation && "<b>Cotisation :</b> " + esc(I.cotisation)].filter(Boolean).join("<br>") + '<br>Consultez aussi l\'<a href="#horaire">horaire</a> complet.';
    if (lienOk(I.lienInscription)) { $("#insc-externe").style.display = ""; $("#lien-insc").href = I.lienInscription; $("#f-inscription").style.display = "none"; }
    $("#annee").textContent = new Date().getFullYear();
  }

  /* ---------- Annonces ---------- */
  function rAnnonces() {
    var l = liste(D.annonces).slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    $("#liste-annonces").innerHTML = l.slice(0, 4).map(function (a) {
      return '<div style="border-left:4px solid var(--lime);padding:2px 0 2px 12px;margin-bottom:14px"><div class="aide">' + fDate(a.date) + '</div><b style="color:var(--marine);font-size:1.1rem">' + esc(a.titre) + '</b><div style="white-space:pre-wrap">' + esc(a.texte) + "</div></div>";
    }).join("") || '<div class="vide">Aucune annonce pour le moment.</div>';
  }

  /* ---------- Événements ---------- */
  function evtHtml(e) {
    var p = e.date.split("-").map(Number);
    return '<div class="evt"><div class="evt-l"><div class="dateb"><div class="m">' + MOIS_C[p[1] - 1] + '</div><div class="j">' + ("0" + p[2]).slice(-2) + "</div></div>" +
      "<div><h4>" + esc(e.titre) + '</h4><div class="ou"><svg><use href="#i-pin"/></svg>' + esc(e.lieu || I.lieu || "Lieu à confirmer") + (e.heure ? " · " + fHeure(e.heure) : "") + "</div></div>" +
      '<button class="pill" type="button" data-details>Détails</button></div>' +
      '<div class="evt-d"><span class="badge ' + (e.type === "tournoi" ? "orange" : "") + '">' + esc(TYPES[e.type] || "Activité") + '</span> <span class="aide">' + fDate(e.date) + (e.heure ? ", " + fHeure(e.heure) : "") + "</span>" +
      (e.details ? "<p>" + esc(e.details) + "</p>" : "") + "</div></div>";
  }
  function rEvenements() {
    var t = auj(), l = liste(D.evenements).filter(function (e) { return dateValide(e.date); });
    var av = l.filter(function (e) { return e.date >= t; }).sort(function (a, b) { return (a.date + (a.heure || "")).localeCompare(b.date + (b.heure || "")); });
    var pa = l.filter(function (e) { return e.date < t; }).sort(function (a, b) { return b.date.localeCompare(a.date); });
    var v = function (m) { return '<div class="vide">' + m + "</div>"; };
    $("#acc-evts").innerHTML = av.slice(0, 3).map(evtHtml).join("") || v("Aucun événement prévu pour l'instant.");
    $("#liste-evts").innerHTML = av.map(evtHtml).join("") || v("Aucune activité prévue pour l'instant.");
    $("#liste-evts-passes").innerHTML = pa.slice(0, 20).map(evtHtml).join("") || v("Aucune activité passée.");
    $("#tournois-av").innerHTML = av.filter(function (e) { return e.type === "tournoi"; }).map(evtHtml).join("") || v("Aucun tournoi annoncé pour l'instant. Restez à l'affût !");
    $("#tournois-pa").innerHTML = pa.filter(function (e) { return e.type === "tournoi"; }).map(evtHtml).join("") || v("Aucun tournoi passé.");
  }

  /* ---------- Résultats et classement ---------- */
  function matchs() {
    return liste(D.resultats).filter(function (m) {
      return liste(m.equipeA).length && liste(m.equipeB).length && typeof m.pointsA === "number" && typeof m.pointsB === "number" && m.pointsA !== m.pointsB;
    });
  }
  function classement() {
    var t = {};
    matchs().forEach(function (m) {
      var cumul = function (eq, pf, pc, v) {
        eq.forEach(function (n) { var k = cle(n); if (!k) return; var r = t[k] || (t[k] = { nom: String(n).trim(), mj: 0, v: 0, d: 0, pf: 0, pc: 0 }); r.mj++; r.pf += pf; r.pc += pc; if (v) r.v++; else r.d++; });
      };
      cumul(m.equipeA, m.pointsA, m.pointsB, m.pointsA > m.pointsB);
      cumul(m.equipeB, m.pointsB, m.pointsA, m.pointsB > m.pointsA);
    });
    return Object.keys(t).map(function (k) { return t[k]; }).sort(function (x, y) { return y.v - x.v || (y.v / y.mj) - (x.v / x.mj) || (y.pf - y.pc) - (x.pf - x.pc) || x.nom.localeCompare(y.nom, "fr"); });
  }
  function matchHtml(m) {
    var ga = m.pointsA > m.pointsB, noms = function (e) { return e.map(esc).join(" & "); };
    return '<div class="match"><div class="' + (ga ? "g" : "") + '">' + noms(m.equipeA) + '</div><div class="score">' + m.pointsA + " – " + m.pointsB + '</div><div class="d ' + (!ga ? "g" : "") + '">' + noms(m.equipeB) + '</div><div class="meta">' + fDate(m.date) + "</div></div>";
  }
  function rResultats() {
    var l = matchs().slice().sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    $("#liste-matchs").innerHTML = l.map(matchHtml).join("") || '<div class="vide">Aucun match inscrit pour l\'instant.</div>';
    $("#acc-matchs").innerHTML = l.slice(0, 4).map(matchHtml).join("") || '<div class="vide">Les résultats apparaîtront ici dès les premiers matchs.</div>';
    var cl = classement(), med = ["🥇", "🥈", "🥉"];
    $("#tb-classement").innerHTML = cl.map(function (r, i) {
      var df = r.pf - r.pc;
      return '<tr><td class="rang">' + (med[i] || i + 1) + "</td><td><b>" + esc(r.nom) + '</b></td><td class="num">' + r.mj + '</td><td class="num">' + r.v + '</td><td class="num">' + r.d + '</td><td class="num">' + Math.round(100 * r.v / r.mj) + '</td><td class="num">' + (df > 0 ? "+" : "") + df + '</td><td class="num"><b>' + r.v * 2 + "</b></td></tr>";
    }).join("") || '<tr><td colspan="8" class="vide">Le classement apparaîtra dès que des résultats seront inscrits.</td></tr>';
    $("#acc-classement").innerHTML = cl.slice(0, 5).map(function (r, i) {
      return '<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--ligne)"><span class="rang">' + (med[i] || i + 1) + '</span><div class="avatar" style="width:36px;height:36px;background:' + coul(r.nom) + '">' + esc(initiales(r.nom)) + '</div><b style="flex:1">' + esc(r.nom) + '</b><span class="badge lime">' + r.v * 2 + " pts</span></div>";
    }).join("") || '<div class="vide">Le classement apparaîtra après les premiers matchs.</div>';
  }

  /* ---------- Communauté ---------- */
  var RESEAUX = [
    ["groupeFacebook", "Groupe Facebook", "Nouvelles et discussions", "#1877F2", "i-fb"],
    ["messenger", "Messenger", "Discussion de groupe", "#7B4DFF", "i-bulle"],
    ["whatsapp", "WhatsApp", "Groupe de la ligue", "#25D366", "i-bulle"],
    ["discord", "Discord", "Salon de clavardage", "#5865F2", "i-jeu"]
  ];
  function rCommunaute() {
    var h = RESEAUX.filter(function (r) { return lienOk(C[r[0]]); }).map(function (r) {
      return '<a class="lien-com" href="' + esc(C[r[0]]) + '" target="_blank" rel="noopener"><span class="ic" style="background:' + r[3] + '"><svg><use href="#' + r[4] + '"/></svg></span><span>' + r[1] + "<small>" + r[2] + "</small></span></a>";
    }).join("");
    $("#liens-com").innerHTML = h || '<div class="carte vide" style="grid-column:1/-1">Les liens vers nos groupes de discussion seront ajoutés bientôt. En attendant, écrivez-nous depuis la page <a href="#contact">Nous joindre</a>.</div>';
    var g = C.giscus || {};
    if (g.repo && g.repoId && g.categorieId) $("#forum-zone").style.display = "";
    rJoueurs();
  }
  var forumCharge = false;
  function chargerForum() {
    var g = C.giscus || {};
    if (forumCharge || !(g.repo && g.repoId && g.categorieId)) return;
    forumCharge = true;
    var s = document.createElement("script");
    s.src = "https://giscus.app/client.js";
    var attrs = { "data-repo": g.repo, "data-repo-id": g.repoId, "data-category": g.categorie || "General", "data-category-id": g.categorieId,
      "data-mapping": "specific", "data-term": "Discussions de la ligue", "data-strict": "0", "data-reactions-enabled": "1", "data-emit-metadata": "0",
      "data-input-position": "top", "data-theme": "light", "data-lang": "fr", "data-loading": "lazy", "crossorigin": "anonymous" };
    Object.keys(attrs).forEach(function (k) { s.setAttribute(k, attrs[k]); });
    s.async = true;
    $("#forum").appendChild(s);
  }
  function rJoueurs() {
    var q = cle($("#q-joueur").value), n = $("#q-niveau").value, c = $("#q-cherche").checked;
    var l = liste(D.joueurs).filter(function (j) { return j && j.nom; })
      .filter(function (j) { return (!q || cle(j.nom).indexOf(q) >= 0) && (!n || String(j.niveau || "").charAt(0) === n) && (!c || j.cherchePartenaire); })
      .sort(function (a, b) { return a.nom.localeCompare(b.nom, "fr"); });
    $("#liste-joueurs").innerHTML = l.map(function (j) {
      return '<div class="joueur"><div class="avatar" style="background:' + coul(j.nom) + '">' + esc(initiales(j.nom)) + "</div><div><h4>" + esc(j.nom) + "</h4>" +
        "<p>" + (j.niveau ? "Niveau " + esc(j.niveau) : "") + (j.dispo ? " · " + esc(j.dispo) : "") + "</p>" +
        (j.cherchePartenaire ? '<p><span class="badge lime">Cherche un partenaire</span></p>' : "") + "</div></div>";
    }).join("") || '<div class="vide">' + (liste(D.joueurs).length ? "Aucun joueur ne correspond à la recherche." : "La liste des joueurs sera publiée après les inscriptions.") + "</div>";
  }

  /* ---------- Galerie ---------- */
  function rGalerie() {
    var l = liste(D.photos).filter(function (p) { return p && p.fichier && !/[\\:]|\.\./.test(p.fichier); });
    $("#galerie").innerHTML = l.map(function (p) {
      return '<figure class="photo"><img src="photos/' + encodeURI(p.fichier) + '" alt="' + esc(p.legende || "Photo de la ligue") + '" loading="lazy" data-zoom>' + (p.legende ? "<figcaption>" + esc(p.legende) + "</figcaption>" : "") + "</figure>";
    }).join("") || '<div class="vide">Les premières photos arrivent bientôt !</div>';
  }

  /* ---------- Formulaires (par courriel) ---------- */
  function envoyerCourriel(sujet, corps) {
    if (!I.courriel) { toast("L'adresse courriel de la ligue n'a pas encore été indiquée."); return; }
    location.href = "mailto:" + encodeURIComponent(I.courriel).replace("%40", "@") + "?subject=" + encodeURIComponent(sujet) + "&body=" + encodeURIComponent(corps);
    toast("Votre logiciel de courriel s'ouvre : il ne reste qu'à envoyer le message.");
  }
  function brancherFormulaires() {
    $("#f-inscription").addEventListener("submit", function (e) {
      e.preventDefault(); var f = e.target;
      envoyerCourriel("Inscription à la ligue : " + f.nom.value.trim(),
        "Bonjour,\n\nJe souhaite m'inscrire à la Ligue de Pickleball de Gracefield.\n\nNom : " + f.nom.value.trim() + "\nNiveau : " + f.niveau.value + "\nCourriel : " + f.courriel.value.trim() +
        "\nTéléphone : " + (f.tel.value.trim() || "-") + "\nDisponibilités : " + (f.dispo.value.trim() || "-") + "\n\nCommentaires :\n" + (f.note.value.trim() || "-") + "\n\nMerci !");
    });
    $("#f-contact").addEventListener("submit", function (e) {
      e.preventDefault(); var f = e.target;
      envoyerCourriel(f.sujet.value + " : " + f.nom.value.trim(), f.message.value.trim() + "\n\n" + f.nom.value.trim());
    });
    $("#f-infolettre").addEventListener("submit", function (e) {
      e.preventDefault();
      if (lienOk(I.lienInfolettre)) { window.open(I.lienInfolettre, "_blank", "noopener"); return; }
      envoyerCourriel("Abonnement à l'infolettre", "Bonjour,\n\nJe souhaite recevoir l'infolettre de la ligue à l'adresse : " + e.target.courriel.value.trim() + "\n\nMerci !");
    });
  }

  /* ---------- Démarrage ---------- */
  function demarrer() {
    if (!window.LIGUE) {
      document.body.insertAdjacentHTML("afterbegin", '<div class="note" style="margin:0;border-radius:0">Le fichier <b>donnees.js</b> contient une erreur ou est introuvable : vérifiez les guillemets et les virgules de la dernière modification.</div>');
    }
    rInfos(); rAnnonces(); rEvenements(); rResultats(); rCommunaute(); rGalerie(); brancherFormulaires();
    $("#burger").addEventListener("click", function () { $("#nav").classList.toggle("ouvert"); });
    ["#q-joueur", "#q-niveau", "#q-cherche"].forEach(function (s) { $(s).addEventListener(s === "#q-joueur" ? "input" : "change", rJoueurs); });
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-details]"); if (b) { b.closest(".evt").classList.toggle("ouvert"); return; }
      var z = e.target.closest("[data-zoom]"); if (z) { var v = $("#visionneuse"); v.querySelector("img").src = z.src; v.querySelector("p").textContent = z.alt; v.classList.add("vis"); }
    });
    $("#visionneuse").addEventListener("click", function () { this.classList.remove("vis"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") $("#visionneuse").classList.remove("vis"); });
    window.addEventListener("hashchange", route);
    route();
  }
  demarrer();
})();
