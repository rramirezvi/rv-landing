const phrases = [
    "Nunca pares de compilar tus sueños ",
    "El futuro se programa línea por línea ",
    "El gran motor del cambio -La Tecnología- ",
    "Cada línea de código cuenta ",
    "Si puedes imaginarlo, puedes programarlo ",
    "El código es poesía para los ingenieros ",
    "Cada error es una oportunidad para aprender ",
    "Construyendo el mañana, un commit a la vez "

];
const icon = "<i class='bi bi-terminal-fill blink-terminal'></i>";
const speed = 80;        // velocidad escritura
const eraseSpeed = 50;   // velocidad borrado
const delay = 1500;      // pausa antes de borrar
let phraseIndex = 0;
let i = 0;
let writing = true;
let iconShown = false;

function typeLoop() {
    const el = document.getElementById("typewriter");
    const text = phrases[phraseIndex];

    if (writing) {
        if (i < text.length) {
            el.innerHTML = text.substring(0, i + 1);
            i++;
            setTimeout(typeLoop, speed);
        } else if (!iconShown) {
            el.innerHTML = text + icon;   // añade el ícono al final
            iconShown = true;
            setTimeout(typeLoop, delay);  // pausa con ícono parpadeando
        } else {
            writing = false;
            setTimeout(typeLoop, eraseSpeed);
        }
    } else {
        if (i > 0) {
            el.innerHTML = text.substring(0, i - 1);
            i--;
            setTimeout(typeLoop, eraseSpeed);
        } else {
            el.innerHTML = "";  // borra de golpe
            writing = true;
            iconShown = false;
            phraseIndex = (phraseIndex + 1) % phrases.length; // siguiente frase
            setTimeout(typeLoop, speed);
        }
    }
}

typeLoop();