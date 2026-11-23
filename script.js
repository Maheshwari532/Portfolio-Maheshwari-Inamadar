
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Theme toggle ---------- */

  const root = document.documentElement;
  const themeToggle = $("#themeToggle");

  try {
    const saved = localStorage.getItem("theme");
    if (saved) root.setAttribute("data-theme", saved);
  } catch (e) {}

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next =
        root.getAttribute("data-theme") === "light" ? "dark" : "light";

      root.setAttribute("data-theme", next);

      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  /* ---------- Mobile menu ---------- */

  const burger = $("#hamburger");
  const links = $("#navLinks");

  const closeMenu = () => {
    if (!burger || !links) return;

    burger.classList.remove("open");
    links.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  };

  if (burger && links) {
    burger.setAttribute("aria-expanded", "false");

    burger.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");

      burger.classList.toggle("open", isOpen);
      burger.setAttribute("aria-expanded", String(isOpen));
    });

    $$("a", links).forEach(a =>
      a.addEventListener("click", closeMenu)
    );

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- Scroll effects ---------- */

  const navbar = $("#navbar");
  const progress = $("#progress");
  const sections = $$("main section[id]");
  const navAnchors = links ? $$("a", links) : [];

  function onScroll() {
    const y = window.scrollY;
    const max =
      document.documentElement.scrollHeight - window.innerHeight;

    if (navbar) {
      navbar.classList.toggle("scrolled", y > 30);
    }

    if (progress) {
      progress.style.width =
        (max > 0 ? (y / max) * 100 : 0) + "%";
    }

    let current = "";

    sections.forEach(sec => {
      if (y >= sec.offsetTop - window.innerHeight * 0.35) {
        current = sec.id;
      }
    });

    navAnchors.forEach(a => {
      a.classList.toggle(
        "active",
        a.getAttribute("href") === "#" + current
      );
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Typing effect ---------- */

  const roles = [
    "Software Developer",
    "Full-Stack Web Developer",
    "Python & Java Programmer",
    "AI / ML Enthusiast"
  ];

  const typed = $("#typed");

  let r = 0;
  let c = 0;
  let deleting = false;

  function type() {
    if (!typed) return;

    const word = roles[r];

    typed.textContent = word.slice(0, c);

    if (!deleting && c < word.length) {
      c++;
      setTimeout(type, 85);
      return;
    }

    if (!deleting && c === word.length) {
      deleting = true;
      setTimeout(type, 1600);
      return;
    }

    if (deleting && c > 0) {
      c--;
      setTimeout(type, 45);
      return;
    }

    deleting = false;
    r = (r + 1) % roles.length;

    setTimeout(type, 350);
  }

  if (typed) type();

  /* ---------- Reveal animations ---------- */

  $$(".skills-grid, .project-grid, .cert-grid, .stats").forEach(grid => {
    $$(".reveal, .stat, .cert", grid).forEach((el, i) => {
      el.classList.add("reveal");
      el.style.setProperty("--d", i * 0.1 + "s");
    });
  });

  const countUp = el => {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || "0", 10);

    if (!Number.isFinite(target)) return;

    const start = performance.now();
    const dur = 1400;

    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);

      el.textContent = (target * eased).toFixed(dec);

      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;

        el.classList.add("in");

        $$("[data-count]", el).forEach(countUp);

        if (el.matches("[data-count]")) {
          countUp(el);
        }

        $$(".fill", el).forEach(fill => {
          const width = parseFloat(fill.dataset.w);

          if (Number.isFinite(width)) {
            fill.style.width = width + "%";
          }
        });

        io.unobserve(el);
      });
    }, { threshold: 0.15 });

    $$(".reveal").forEach(el => io.observe(el));
  } else {
    $$(".reveal").forEach(el => el.classList.add("in"));

    $$("[data-count]").forEach(el => {
      const target = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || "0", 10);

      if (Number.isFinite(target)) {
        el.textContent = target.toFixed(dec);
      }
    });

    $$(".fill").forEach(fill => {
      if (fill.dataset.w) {
        fill.style.width = fill.dataset.w + "%";
      }
    });
  }

  /* ---------- Contact form ---------- */

  const form = $("#contactForm");
  const note = $("#formNote");

  const EMAIL = "maheshwariinamadar28@gmail.com";

  // Optional: Add your Formspree endpoint here.
  const FORM_ENDPOINT = "";

  if (form && note) {
    form.addEventListener("submit", async e => {
      e.preventDefault();

      const name = $("#name")?.value.trim() || "";
      const email = $("#email")?.value.trim() || "";
      const message = $("#message")?.value.trim() || "";

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const validEmail = emailPattern.test(email);

      ["name", "email", "message"].forEach(id => {
        $("#" + id)?.parentElement?.classList.remove("error");
      });

      const bad = [];

      if (!name) bad.push("name");
      if (!validEmail) bad.push("email");
      if (!message) bad.push("message");

      if (bad.length) {
        bad.forEach(id => {
          $("#" + id)?.parentElement?.classList.add("error");
        });

        note.className = "form-note err";
        note.textContent =
          "Please fill in all fields with a valid email.";

        return;
      }

      note.className = "form-note";

      const subject = "Portfolio enquiry from " + name;

      const text =
        message + "\n\n— " + name + " (" + email + ")";

      /* Option 1: Formspree */

      if (FORM_ENDPOINT) {
        note.textContent = "Sending…";

        try {
          const res = await fetch(FORM_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify({ name, email, message })
          });

          if (!res.ok) {
            throw new Error("Request failed");
          }

          note.textContent =
            "Thanks! Your message has been sent.";

          form.reset();

        } catch (err) {
          note.className = "form-note err";
          note.textContent =
            "Could not send. Please email me directly at " + EMAIL;
        }

        return;
      }

      /* Option 2: Open a pre-filled Gmail draft */

      const gmail =
        "https://mail.google.com/mail/?view=cm&fs=1&to=" +
        encodeURIComponent(EMAIL) +
        "&su=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(text);

      window.open(gmail, "_blank", "noopener,noreferrer");

      note.textContent =
        "If Gmail opened, review your message and press Send.";

      form.reset();
    });
  }

  /* ---------- Footer year ---------- */

  const year = $("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

})();
