// ================= ELEMENTS =================
const greetingEl = document.querySelector(".greeting-text");
const roleEl = document.querySelector(".role-text");
const descEl = document.querySelector(".desc");
const socialEls = document.querySelectorAll(".social-icons a");
const profileEl = document.querySelector(".home-right");
const aboutBtn = document.querySelector(".about-btn");
const cvBtn = document.querySelector(".cv-btn");
const scrollEl = document.querySelector(".scroll-indicator");
const homeSection = document.querySelector("#home");

const greetingText = "Hello, I'm Owen Paredes";
const roleText = "IT & Data Management Analyst";

let isHomeVisible = false;
let introPlayed = false;
let loopController = 0;
let loopTimeout = null;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeText(element, text, speed = 60) {
    element.textContent = "";
    for (let i = 0; i < text.length; i++) {
        element.textContent += text[i];
        await sleep(speed);
    }
}

async function deleteText(element, speed = 40, controller) {
    while (element.textContent.length) {
        if (controller !== loopController) return;
        element.textContent = element.textContent.slice(0, -1);
        await sleep(speed);
    }
}

async function playIntro() {
    await typeText(greetingEl, greetingText, 60);
    await typeText(roleEl, roleText, 60);

    descEl.style.display = "block";
    descEl.classList.add("active");

    for (let el of socialEls) {
        el.classList.add("active");
        await sleep(200);
    }

    aboutBtn.classList.add("active");
    cvBtn.classList.add("active");
    scrollEl.classList.add("active");
    profileEl.classList.add("active");
}

async function startGreetingLoop() {
    const controller = ++loopController;

    while (isHomeVisible && controller === loopController) {
        await deleteText(greetingEl, 40, controller);
        await sleep(300);
        await typeText(greetingEl, greetingText, 60);
        await sleep(1000);
    }
}

function scheduleLoop() {
    if (loopTimeout) return;

    loopTimeout = setTimeout(() => {
        loopTimeout = null;
        if (isHomeVisible) {
            startGreetingLoop();
        }
    }, 5000);
}

function stopLoop() {
    loopController++; 
    if (loopTimeout) {
        clearTimeout(loopTimeout);
        loopTimeout = null;
    }
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            isHomeVisible = true;

            if (!introPlayed) {
                introPlayed = true;
                playIntro().then(() => {
                    scheduleLoop();
                });
            } else {
                scheduleLoop();
            }

        } else {
            isHomeVisible = false;
            stopLoop(); 
        }
    });
}, { threshold: 0.6 });

observer.observe(homeSection);


// ================= THEME TOGGLE =================
const toggleBtn = document.getElementById("toggleTheme");
toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    toggleBtn.querySelector("i").classList.toggle("fa-sun");
    toggleBtn.querySelector("i").classList.toggle("fa-moon");
});

// ================= HAMBURGER MENU =================
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

// ================= ACTIVE NAV HIGHLIGHT =================
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let current = "";
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute("id");
        }
    });

    navItems.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});

// ================= REVEAL ON SCROLL =================
const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

reveals.forEach(el => revealObserver.observe(el));

// ================= CV MODAL =================
const cvModal = document.getElementById("cvPreview");
const cvClose = cvModal.querySelector(".cv-close");

cvBtn.addEventListener("click", (e) => {
    e.preventDefault();
    cvModal.classList.add("active");
});

cvClose.addEventListener("click", () => cvModal.classList.remove("active"));

cvModal.addEventListener("click", e => {
    if (e.target === cvModal) cvModal.classList.remove("active");
});

// ================= ABOUT TABS =================
document.addEventListener("DOMContentLoaded", () => {
  const about = document.querySelector(".about-pro");
  const tabs = about.querySelectorAll(".about-tab");
  const panels = about.querySelectorAll(".about-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      about.querySelector(`#${tab.dataset.tab}`).classList.add("active");
    });
  });
});

// ================= CONTACT =================
const form = document.getElementById("contactForm");
const status = document.querySelector(".form-status");
const inputs = form.querySelectorAll("input[required], textarea[required]");

const fieldLabels = {
  name: "Your Name",
  email: "Email Address",
  message: "Your Message"
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

inputs.forEach((input) => {
  input.addEventListener("input", () => {
    const group = input.closest(".input-group");
    const errorBox = group.querySelector(".field-error");

    if (
      input.checkValidity() &&
      (input.type !== "email" || isValidEmail(input.value))
    ) {
      input.classList.remove("error");
      input.classList.add("valid");

      // clear inline error
      errorBox.textContent = "";
      errorBox.classList.remove("active");
    } else {
      input.classList.remove("valid");
      input.classList.add("error");
    }
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let hasError = false;

  inputs.forEach((input) => {
    const value = input.value.trim();
    const label = fieldLabels[input.name] || "This field";
    const group = input.closest(".input-group");
    const errorBox = group.querySelector(".field-error");

    errorBox.textContent = "";
    errorBox.classList.remove("active");

    if (!value) {
      input.classList.add("error");
      input.classList.remove("valid");

      errorBox.textContent = `${label} is required.`;
      errorBox.classList.add("active");
      hasError = true;

    } else if (input.type === "email" && !isValidEmail(value)) {
      input.classList.add("error");
      input.classList.remove("valid");

      errorBox.textContent = "Invalid email address.";
      errorBox.classList.add("active");
      hasError = true;

    } else {
      input.classList.remove("error");
      input.classList.add("valid");
    }
  });

  if (hasError) return;

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    status.textContent = result.message;

    if (res.ok) {
      status.classList.remove("error");
      status.classList.add("success");

      form.reset();

      inputs.forEach((input) => {
        input.classList.remove("valid");
        input.classList.remove("error");
      });
    } else {
      status.classList.remove("success");
      status.classList.add("error");
    }

  } catch {
    status.textContent = "Error sending message.";
    status.classList.remove("success");
    status.classList.add("error");
  }
});





