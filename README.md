# Jōurnal
<img width="613" height="124" alt="image" src="https://github.com/user-attachments/assets/dfe4f3b2-ca03-4522-8bae-7cb76bd290bb" />

## A minimalist .txt-based journaling application
A locally-hosted journal for private life.

This is a project I made over the course of a few days, it runs on vanilla html, css, and javascript with an express background. I'm sure it's not the best journaling app, and it's not the fanciest, but it's the app that I use to record my memories.

## Primary Features
- Read, write and edit your daily entries. This application functions best when one writes daily one entry at the end of the day like I habitually do.
- View yesterday, yesterweek, yestermonth, and yesteryear's entries to keep your memories sharp.
- After you clone and compile, use the desktop application for hassle free bootup - powered by electron.

## Compiling the desktop app
`node_modules/` and `dist/` are gitignored, so after cloning you'll need to install dependencies and build the installer yourself:

```bash
git clone <repo-url>
cd JōURNAL
npm install
npm run dist
```

This runs `electron-builder --win` and produces a Windows installer (`Journal Setup 1.0.0.exe`) in `dist/`. Run that installer to get the desktop app.

If you just want to try the app without building an installer, use `npm run electron` instead to launch it directly via Electron.

## Acknowledgements
Book Animations adapted from <a href="https://github.com/petargyurov/virtual-bookshelf/blob/main/bookshelf.css">Virtual Bookshelf</a> by <a href="https://github.com/petargyurov">Petar Gyurov</a> and <a href="https://github.com/petargyurov/virtual-bookshelf/blob/main/bookshelf.css">Roy Moore</a>

## AI disclaimer
All design, conceptualization, front and back-end HTML, CSS, and JS were written by me - with the exception of the electron application wrapper (Claude Code). Primary research tools: Bing (call me crazy), Mozilla JS Docs, *App Brewery: The Complete Full-Stack Web Development Bootcamp*, and Stack Overflow. Specific code and error questions occasionally answered by Bing and Google AI summaries.
