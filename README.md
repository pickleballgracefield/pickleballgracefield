# Ligue de Pickleball de Gracefield

Site web de la ligue, 100 % statique : pas de base de données, pas de serveur. Il s'héberge gratuitement sur **GitHub Pages**.

Tout le contenu (horaire, annonces, résultats, joueurs, photos, liens) se trouve dans **un seul fichier : `donnees.js`**. Le classement se calcule tout seul à partir des résultats.

## Contenu du dépôt

| Fichier ou dossier | Rôle |
|---|---|
| `donnees.js` | **Le seul fichier à modifier** : infos de la ligue, annonces, horaire, joueurs, résultats, photos |
| `photos/` | Les photos de la galerie |
| `index.html` | La page du site (pas besoin d'y toucher) |
| `assets/` | Images de la maquette, polices, style et programme du site |

## Mettre le site en ligne (une seule fois, environ 10 minutes)

1. Créez un compte gratuit sur [github.com](https://github.com).
2. Cliquez sur **+** (en haut à droite) > **New repository**. Nommez-le par exemple `ligue-pickleball-gracefield`, laissez-le **Public**, puis cliquez sur **Create repository**.
3. Sur la page du dépôt, cliquez sur **uploading an existing file**. Glissez **tout le contenu** du dossier décompressé (les fichiers et les dossiers `assets` et `photos`), puis cliquez sur **Commit changes**.
4. Allez dans **Settings** > **Pages**. Sous « Build and deployment », choisissez **Deploy from a branch**, la branche **main** et le dossier **/ (root)**, puis cliquez sur **Save**.
5. Une à deux minutes plus tard, le site est en ligne à l'adresse `https://VOTRE-NOM.github.io/ligue-pickleball-gracefield/`. Elle s'affiche en haut de la page **Settings** > **Pages**.

Vous pouvez aussi relier un nom de domaine (ex. `pickleballgracefield.ca`) dans **Settings** > **Pages** > **Custom domain**.

## Mettre le site à jour

1. Dans le dépôt, ouvrez `donnees.js` et cliquez sur le **crayon** (Edit this file).
2. Modifiez ce que vous voulez en suivant les exemples écrits dans le fichier.
3. Cliquez sur **Commit changes**. Le site se met à jour en une à deux minutes.

**Ajouter une photo :** ouvrez le dossier `photos` > **Add file** > **Upload files**. Ajoutez ensuite une ligne dans la section `photos` de `donnees.js` avec le nom exact du fichier.

**Inscrire un résultat :** ajoutez une ligne dans la section `resultats`. Écrivez les noms exactement de la même façon à chaque fois (majuscules et accents compris), sinon un même joueur apparaîtra deux fois au classement.

> Si le site affiche « Le fichier donnees.js contient une erreur », c'est qu'il manque un guillemet ou une virgule dans la dernière modification. Ouvrez l'historique du fichier (**History**) pour comparer avec la version précédente.

## Comment les joueurs communiquent

Un site statique ne peut pas conserver les messages des visiteurs. Il relie donc les joueurs à des outils gratuits que vous choisissez dans la section `communaute` de `donnees.js` :

- **Groupe Facebook, Messenger, WhatsApp ou Discord** : collez le lien d'invitation et un bouton apparaît dans la page Communauté.
- **Inscriptions, messages et infolettre** : les formulaires du site ouvrent le logiciel de courriel du visiteur avec un message déjà rempli, adressé au `courriel` indiqué dans `infos`. Pour recevoir les inscriptions dans un tableau, créez plutôt un formulaire **Google Forms** et collez son lien dans `lienInscription` (et `lienInfolettre` pour l'infolettre).

### Forum de discussion intégré (facultatif)

Le site peut afficher un forum basé sur **GitHub Discussions**, grâce à [giscus](https://giscus.app/fr). Tout le monde peut le lire, mais il faut un compte GitHub gratuit pour écrire.

1. Dans le dépôt : **Settings** > **General** > section « Features » > cochez **Discussions**.
2. Installez l'application giscus sur le dépôt : [github.com/apps/giscus](https://github.com/apps/giscus) > **Install** > choisissez seulement ce dépôt.
3. Allez sur [giscus.app/fr](https://giscus.app/fr), entrez `VOTRE-NOM/ligue-pickleball-gracefield` et choisissez une catégorie (par exemple « General »).
4. Dans le code proposé plus bas sur la page, copiez les valeurs de `data-repo`, `data-repo-id`, `data-category` et `data-category-id` dans la section `giscus` de `donnees.js`.

## Voir le site sur votre ordinateur avant de le publier

Ouvrez simplement `index.html` dans votre navigateur (double-clic). Les liens de courriel et les images fonctionnent aussi hors ligne.
