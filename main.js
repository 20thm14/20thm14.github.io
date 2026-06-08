const body = document.body;
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector("#navPanel");
const dropdownToggle = document.querySelector(".dropdown-toggle");
const dropdown = document.querySelector(".dropdown");
const searchToggle = document.querySelector(".search-toggle");
const headerSearch = document.querySelector("#headerSearch");
const siteSearch = document.querySelector("#siteSearch");
const cartCount = document.querySelector("#cartCount");
const cartMessage = document.querySelector("#cartMessage");
const cartTotalItems = document.querySelector("#cartTotalItems");
const cartTotalPrice = document.querySelector("#cartTotalPrice");
const clearCart = document.querySelector("#clearCart");
const revealItems = document.querySelectorAll(".reveal");
const slides = document.querySelectorAll(".slide");
const slideDots = document.querySelectorAll(".slide-dots button");
const slidePrev = document.querySelector(".slide-prev");
const slideNext = document.querySelector(".slide-next");
const viewMoreButton = document.querySelector("[data-view-more]");
const extraProducts = document.querySelectorAll(".extra-product");

let cartTotal = Number(localStorage.getItem("fruitables-count")) || 0;
let activeSlide = 0;
let slideTimer;

function setTheme(theme) {
    const isDark = theme === "dark";
    body.classList.toggle("dark-theme", isDark);

    if (themeIcon) {
        themeIcon.textContent = isDark ? "L" : "D";
    }

    if (themeToggle) {
        themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    }

    localStorage.setItem("fruitables-theme", theme);
}

function updateCart() {
    if (cartCount) {
        cartCount.textContent = cartTotal;
    }

    if (cartTotalItems) {
        cartTotalItems.textContent = cartTotal;
    }

    if (cartTotalPrice) {
        cartTotalPrice.textContent = `$${(cartTotal * 4.99).toFixed(2)}`;
    }

    if (cartMessage) {
        cartMessage.textContent = cartTotal
            ? `Your basket has ${cartTotal} fresh item${cartTotal === 1 ? "" : "s"}.`
            : "Your basket is ready for fresh picks.";
    }

    localStorage.setItem("fruitables-count", cartTotal);
}

function setActiveNav() {
    const page = body.dataset.page;
    const activeKey = page === "fruits" || page === "vegetables" ? "products" : page;

    document.querySelectorAll("[data-nav]").forEach((item) => {
        item.classList.toggle("active", item.dataset.nav === page || item.dataset.nav === activeKey);
    });
}

function showSlide(index) {
    if (!slides.length) {
        return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("active", slideIndex === activeSlide);
    });

    slideDots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === activeSlide);
    });
}

function startSlideTimer() {
    if (!slides.length) {
        return;
    }

    clearInterval(slideTimer);
    slideTimer = setInterval(() => {
        showSlide(activeSlide + 1);
    }, 4500);
}

themeToggle?.addEventListener("click", () => {
    setTheme(body.classList.contains("dark-theme") ? "light" : "dark");
});

navToggle?.addEventListener("click", () => {
    const isOpen = navPanel.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
});

dropdownToggle?.addEventListener("click", () => {
    dropdown.classList.toggle("open");
});

navPanel?.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
        navPanel.classList.remove("open");
        navToggle?.setAttribute("aria-expanded", "false");
    }
});

searchToggle?.addEventListener("click", () => {
    headerSearch.classList.toggle("open");

    if (headerSearch.classList.contains("open")) {
        siteSearch?.focus();
    }
});

headerSearch?.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = siteSearch.value.trim().toLowerCase();
    const target = query.includes("vegetable") ? "vegetables.html" : query.includes("deal") ? "deals.html" : "fruits.html";
    window.location.href = target;
});

slidePrev?.addEventListener("click", () => {
    showSlide(activeSlide - 1);
    startSlideTimer();
});

slideNext?.addEventListener("click", () => {
    showSlide(activeSlide + 1);
    startSlideTimer();
});

slideDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        showSlide(index);
        startSlideTimer();
    });
});

viewMoreButton?.addEventListener("click", () => {
    const isOpen = viewMoreButton.dataset.open === "true";

    extraProducts.forEach((card) => {
        card.classList.toggle("show", !isOpen);
        if (!isOpen) {
            card.classList.add("visible");
        }
    });

    viewMoreButton.dataset.open = String(!isOpen);
    viewMoreButton.textContent = isOpen ? "View More" : "View Less";
});

document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => {
        cartTotal += 1;
        updateCart();
        button.textContent = "Added";
        setTimeout(() => {
            button.textContent = "Add";
        }, 900);
    });
});

clearCart?.addEventListener("click", () => {
    cartTotal = 0;
    updateCart();
});

document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    event.currentTarget.reset();
    alert("Thanks! Fruitables will contact you soon.");
});

document.querySelectorAll(".feedback-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        form.reset();
        alert("Thanks for your feedback!");
    });
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.14 });

revealItems.forEach((item) => observer.observe(item));

setTheme(localStorage.getItem("fruitables-theme") || "light");
setActiveNav();
updateCart();
showSlide(0);
startSlideTimer();
