const cards = document.querySelectorAll(".card");

window.addEventListener("scroll", () => {
    const triggerBottom = window.innerHeight - 100;

    cards.forEach(card => {
        const top = card.getBoundingClientRect().top;

        if (top < triggerBottom) {
            card.style.opacity = 1;
            card.style.transform = "translateY(0)";
        }
    });
});
