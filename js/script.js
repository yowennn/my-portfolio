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

// ================= TYPE & DELETE TEXT =================
function typeText(element, text, speed = 60) {
    return new Promise(resolve => {
        let index = 0;
        element.textContent = "";
        const interval = setInterval(() => {
            element.textContent += text[index];
            index++;
            if (index === text.length) {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

function deleteText(element, speed = 40) {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            element.textContent = element.textContent.slice(0, -1);
            if (element.textContent.length === 0) {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

function fadeIn(element) {
    return new Promise(resolve => {
        element.style.display = "block";
        setTimeout(() => {
            element.classList.add("active");
            resolve();
        }, 50);
    });
}

function fadeInSocials() {
    return new Promise(resolve => {
        socialEls.forEach((icon, i) => {
            setTimeout(() => {
                icon.classList.add("active");
                if (i === socialEls.length - 1) resolve();
            }, i * 300);
        });
    });
}

let isHomeVisible = true;
let isGreetingLoopRunning = false;
let greetingLoopTimeout = null;

async function loopGreetingControlled() {
    if (isGreetingLoopRunning) return;
    isGreetingLoopRunning = true;

    while (isHomeVisible) {
        await typeText(greetingEl, greetingText, 60);
        await new Promise(r => setTimeout(r, 800));

        if (!isHomeVisible) break;

        await deleteText(greetingEl, 40);
        await new Promise(r => setTimeout(r, 300));
    }

    isGreetingLoopRunning = false;
}

async function animateHome() {
    await typeText(greetingEl, greetingText, 60);
    await typeText(roleEl, roleText, 60);

    await fadeIn(descEl);
    await fadeInSocials();
    await fadeIn(aboutBtn);
    await fadeIn(cvBtn);
    await fadeIn(scrollEl);
    await fadeIn(profileEl);

    if (greetingLoopTimeout) clearTimeout(greetingLoopTimeout);
    greetingLoopTimeout = setTimeout(() => {
        if (isHomeVisible) loopGreetingControlled();
    }, 5000);
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            isHomeVisible = true;

            if (greetingLoopTimeout) clearTimeout(greetingLoopTimeout);
            greetingLoopTimeout = setTimeout(() => {
                if (isHomeVisible) loopGreetingControlled();
            }, 5000);
        } else {
            isHomeVisible = false;
        }
    });
}, {
    threshold: 0.6
});

observer.observe(homeSection);

animateHome();




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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

inputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.checkValidity()) {
      input.classList.remove("error");
      input.classList.add("valid");
    } else {
      input.classList.remove("valid");
      input.classList.add("error");
    }
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

    const emailInput = form.querySelector('input[name="email"]');
    
    if (!isValidEmail(emailInput.value.trim())) {
    
      emailInput.classList.add("error");
      emailInput.classList.remove("valid");
    
      status.textContent = "Invalid email address.";
      status.classList.remove("success");
      status.classList.add("error");
    
      return;
    }

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

      inputs.forEach((input) => {
        input.classList.remove("error");
        input.classList.add("valid");
      });

      form.reset();
    } else {
      status.classList.remove("success");
      status.classList.add("error");

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          input.classList.remove("valid");
          input.classList.add("error");
        }
      });
    }
  } catch {
    status.textContent = "Error sending message.";
    status.classList.remove("success");
    status.classList.add("error");

    inputs.forEach((input) => input.classList.add("error"));
  }
});





