# Maheshwari Inamadar - Portfolio

A modern, responsive personal portfolio built with plain HTML, CSS and JavaScript (no build step, no dependencies).

## Structure

```
portfolio/
├── index.html
├── css/style.css
├── js/script.js
└── README.md
```

## Run locally

Open `index.html` in any browser, or serve the folder:

```
python3 -m http.server 8000
```

then visit http://localhost:8000

## Sections

Home, About, Skills, Projects, Contact (plus dark/light theme toggle, scroll progress bar, typing effect and scroll-reveal animations).

## Customise

- **LinkedIn link**: in `index.html`, replace `https://www.linkedin.com/` with your profile URL.
- **Project descriptions**: edit the `.project` cards in `index.html` (the AI Resume Analyzer text is generic; update it to match your repo).
- **Skill bars**: change the `data-w` values in the Proficiency block.
- **Photo**: replace the `.avatar` span with `<img src="images/me.jpg" alt="Maheshwari">` and add CSS `object-fit: cover; border-radius: 50%`.
- **Contact form**: by default opens a pre-filled Gmail compose tab. For direct delivery, create a free Formspree form and paste its URL into `FORM_ENDPOINT` at the top of the contact section in `js/script.js`.

## Deploy free

Push the folder to a GitHub repo and enable **Settings → Pages**, or drag the folder onto Netlify / Vercel.
