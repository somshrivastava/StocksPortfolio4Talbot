# Stocks Portfolio 📈

### Live Demo

The app is deployed and available at: [https://stocksportfolio4talbot.web.app](https://stocksportfolio4talbot.web.app)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Description

This project was built for a high school history class competition that my teacher, Mr. Talbot was hosting. Each student "invested" $1,000 in three stocks, and the app tracked whose portfolio performed best over a month. It was designed to make learning about markets and investing fun and interactive. Stocks Portfolio is a web application for tracking, simulating, and visualizing stock portfolios. Built with Angular and Firebase, it allows users to create portfolios, monitor stock performance, and view real-time profit/loss calculations.

## Features

- User authentication (Google sign-in)
- Create and manage multiple portfolios
- Add, edit, and remove stocks
- Real-time price updates and profit/loss calculation
- Admin scoreboard and dashboard
- Responsive UI with PrimeNG components
- Firebase hosting and Firestore integration

## Tech Stack

- Angular 11
- Firebase (Firestore, Auth, Hosting)
- PrimeNG UI library
- TypeScript, SCSS

## Installation

1. Clone the repository:

```sh
git clone https://github.com/somshrivastava/stocks-portfolio.git
cd stocks-portfolio
```

2. Install dependencies:

```sh
npm install --legacy-peer-deps
```

3. Set up Firebase:

- Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
- Add your Firebase config to `src/environments/environment.ts`

4. Run the app locally:

```sh
npx ng serve
```

## Usage

- Sign in with Google
- Create a new portfolio and add stocks by symbol and price
- View dashboard for real-time updates and profit/loss
- Admin users can access the scoreboard

**Example:**

```sh
npx ng serve
# Open http://localhost:4200 in your browser
```

## License

This project is licensed under the MIT License.
