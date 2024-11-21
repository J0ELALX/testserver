// Smooth Scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});

// Modal functionality
const modal = document.getElementById("eventsModal");
const eventsButton = document.getElementById("eventsButton");
const closeBtn = document.querySelector(".close-btn");

eventsButton.addEventListener("click", function () {
    modal.style.display = "block";
});

closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

// Close the modal if clicked outside of it
window.addEventListener("click", function (e) {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Scroll Animation (Fade In Effect)
window.addEventListener("scroll", function () {
    const elements = document.querySelectorAll(".empowering-content, #about h2, #about p, .accordion");
    elements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add("animate");
        }
    });

    // Parallax Effect (for background images)
    const background = document.getElementById('empowering');
    let scrollPosition = window.scrollY;
    background.style.backgroundPosition = 'center ' + (scrollPosition * 0.5) + 'px';

    // Show Progress Bar as the user scrolls
    let scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    document.getElementById("progressBar").style.width = scrollPercentage + "%";

    // Sticky Header
    const header = document.getElementById("header");
    if (window.scrollY > 100) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
});
