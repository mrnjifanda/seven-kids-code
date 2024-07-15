let etatVentilateur = false; // Variable pour stocker l'état du ventilateur (allumé ou éteint)
let vitesseVentilateur = 0; // Variable pour stocker la vitesse du ventilateur (0, 1, 2 ou 3)
let animationEnCours = false; // Variable pour stocker l'état de l'animation

const socket = io();

// Fonction pour allumer le ventilateur
function allumerVentilateur() {
    if (!etatVentilateur) {

        etatVentilateur = true;
        document.getElementById('etat-ventilateur').firstElementChild.textContent = 'Ventilateur allumé';

        // Démarrer l'animation si elle n'est pas déjà en cours
        if (!animationEnCours) {
            demarrerAnimation();
            animationEnCours = true;
        }

        socket.emit('allumer', {'status': 5});
    } else {
        eteindreVentilateur();
    }
}

// Fonction pour éteindre le ventilateur
function eteindreVentilateur() {

    if (etatVentilateur) {

        etatVentilateur = false;
        document.getElementById('etat-ventilateur').firstElementChild.textContent = 'Ventilateur éteint';
        vitesseVentilateur = 0; // Réinitialiser la vitesse
        document.getElementById('statistiques').children[1].textContent = 'Niveau de vitesse: 0';

        // Arrêter l'animation si elle est en cours
        if (animationEnCours) {

            arreterAnimation();
            animationEnCours = false;
        }
    }
}

// Fonction pour changer de vitesse du ventilateur
function changerVitesse(nouvelleVitesse) {

    if (etatVentilateur) {

        if (nouvelleVitesse >= 0 && nouvelleVitesse <= 3) {

            vitesseVentilateur = nouvelleVitesse;
            document.getElementById('statistiques').children[1].textContent = `Niveau de vitesse: ${vitesseVentilateur + 1}`;
            
            const dureeAnimation = 2 / (nouvelleVitesse + 1); // Durée inversement proportionnelle à la vitesse

            // Mettre à jour la propriété CSS animation-duration
            document.querySelector('.ventilateur-img').style.animationDuration = `${dureeAnimation}s`;

            socket.emit('vitesse', { "speed": nouvelleVitesse + 1 });
        } else {

            alert('Vitesse invalide. Veuillez choisir une vitesse entre 0 et 3.');
        }
    } else {

        alert('Veuillez d\'abord allumer le ventilateur avant de changer de vitesse.');
    }
}

// Fonction pour démarrer l'animation
function demarrerAnimation() {

    const elementVentilateur = document.querySelector('.ventilateur-img');
    elementVentilateur.style.animationDuration = `${2 / (vitesseVentilateur + 1)}s`;
    elementVentilateur.style.animationPlayState = 'running';
}

// Fonction pour arrêter l'animation
function arreterAnimation() {

    document.querySelector('.ventilateur-img').style.animationPlayState = 'paused';
}

// Événements pour les boutons
document.getElementById('bouton-allumage').addEventListener('click', allumerVentilateur);
document.getElementById('bouton-vitesse-1').addEventListener('click', () => changerVitesse(0));
document.getElementById('bouton-vitesse-2').addEventListener('click', () => changerVitesse(1));
document.getElementById('bouton-vitesse-3').addEventListener('click', () => changerVitesse(2));
