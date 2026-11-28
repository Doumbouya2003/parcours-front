<script>
(function () {
  var lieux = [];
  var champ = document.getElementById("recherche");
  var liste = document.getElementById("resultats");
  var message = document.getElementById("message-recherche");

  // Compare sans tenir compte des accents ni des majuscules
  function normaliser(s) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }

  function libelleEtage(n) {
    if (n === 0) return "rez-de-chaussée";
    if (n === 1) return "1er étage";
    return n + "e étage";
  }

  function afficherFiche(lieu) {
    document.getElementById("fiche-categorie").textContent = lieu.categorie;
    document.getElementById("fiche-nom").textContent = lieu.nom;
    document.getElementById("fiche-emplacement").textContent =
      lieu.batiment + ", " + libelleEtage(lieu.etage);
    document.title = lieu.nom + " – Lieux du campus";
    champ.value = "";
    liste.textContent = "";
    message.hidden = true;
  }

  function chercher() {
    var q = normaliser(champ.value);
    liste.textContent = "";
    message.hidden = true;
    if (q === "") return;

    var trouves = lieux.filter(function (l) {
      return normaliser(l.nom).indexOf(q) !== -1;
    });

    if (trouves.length === 0) {
      message.textContent = "Aucun lieu ne correspond à cette recherche.";
      message.hidden = false;
      return;
    }

    trouves.forEach(function (l) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      var nom = document.createElement("strong");
      nom.textContent = l.nom;
      var detail = document.createElement("small");
      detail.textContent = l.categorie + ", " + l.batiment + ", " + libelleEtage(l.etage);
      b.append(nom, detail);
      b.addEventListener("click", function () { afficherFiche(l); });
      li.appendChild(b);
      liste.appendChild(li);
    });
  }

  champ.addEventListener("input", chercher);

  fetch("lieux.json")
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (donnees) { lieux = donnees; })
    .catch(function () {
      message.textContent = "Impossible de charger lieux.json. Ouvrez la page depuis un serveur local (python3 -m http.server).";
      message.hidden = false;
    });
})();
</script>