# VanHaaster Dashboard

Een simpele login dashboard gebouwd met React, Next.js en TypeScript.

## Features

- 🔐 User authentication met React Context
- 📱 Responsive design met Tailwind CSS
- 🎨 Moderne UI met mooie animaties
- 🔒 Session persistence (localStorage)
- 📊 Dashboard met gebruikersinformatie
- ⚡ TypeScript voor type safety
- 🚀 Next.js 15 met App Router

## Project Structuur

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout met AuthProvider
│   ├── page.tsx        # Hoofdpagina (login/dashboard)
│   └── globals.css     # Global styles
├── components/         # React componenten
│   ├── LoginForm.tsx   # Login formulier
│   └── Dashboard.tsx   # Dashboard component
├── lib/               # Utilities en context
│   └── auth-context.tsx # Authentication context
├── types/             # TypeScript type definities
│   └── auth.ts        # Auth gerelateerde types
└── hooks/             # Custom React hooks
```

## Demo Credentials

Voor het testen van de login functionaliteit:

- **Email:** `ron.stoel@vanhaaster.nl`
- **Password:** `SdfnjSDF432!`

## Installatie

1. Clone het project:
```bash
git clone <repository-url>
cd vanhaasterdash
```

2. Installeer dependencies:
```bash
npm install
```

3. Start de development server:
```bash
npm run dev
```

4. Open [http://localhost:8000](http://localhost:8000) in je browser.

## Scripts

- `npm run dev` - Start development server op poort 8000
- `npm run build` - Build voor productie
- `npm run start` - Start productie server op poort 8000
- `npm run lint` - Run ESLint

## Technologieën

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **ESLint** - Code linting

## Functionaliteiten

### Authentication
- Login met email en wachtwoord
- Session persistence met localStorage
- Loading states tijdens login
- Error handling voor ongeldige credentials

### Dashboard
- Welkomstbericht met gebruikersnaam
- Gebruikersinformatie weergave
- Statistieken cards
- Logout functionaliteit
- Responsive grid layout

### UI/UX
- Moderne gradient achtergronden
- Smooth hover animaties
- Loading spinners
- Error message styling
- Responsive design voor alle schermformaten

## Ontwikkeling

Het project gebruikt de nieuwste versies van Next.js en React met de App Router. Alle componenten zijn geschreven in TypeScript voor betere type safety en developer experience.

## Licentie

MIT License
