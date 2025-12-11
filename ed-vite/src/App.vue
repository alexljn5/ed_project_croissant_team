<!-- # Rohit - heeft dit gedaan Navigatiebalk aangepast: - Logo en knoppen verplaatst naar rechts - Alleen logo is klikbaar naar homepage - Dubbeloproute titel is niet meer klikbaar -->
<template>
  <div class="app-layout">
    <!-- Navigation Header -->
    <header class="header-top">
      <div class="header-container">
        <h1 class="dubbeloproute-titel">Dubbelop-route</h1>
        <div class="header-right">
          <router-link to="/admin" class="admin-button">
            <button class="adminKnop">Admin</button>
          </router-link>
          <router-link to="/contact" class="contact-button">
            <button class="contactKnop">Neem Contact Op</button>
          </router-link>
          <router-link to="/" class="logo-link">
            <div class="logo">
              <img
                src="/src/assets/img/dubbelop-logo.png"
                alt="Dubbelop Logo"
              />
            </div>
          </router-link>
        </div>
      </div>
    </header>
    <!-- Page Content -->
    <router-view />
    <!-- Middle Section with Image and Text -->
    <section class="middle-section">
      <div class="middle-container">
        <img
          src="/src/assets/img/dubbel-op_3804141577.webp"
          alt="Bottom section image"
          class="middle-image"
        />
        <div>
          <h1>Wat was Dubbel-Op?</h1>
          <p class="middle-text">
            Dubbel-Op was een pannenkoekenrestaurant gelegen aan Wold 11-10 in
            Lelystad. Het stond bekend als een familievriendelijk restaurant
            waar je uit veel soorten pannenkoeken kon kiezen en vooral populair
            was bij gezinnen met kinderen. Er waren o.a. mogelijkheden om zelf
            ingrediënten te kiezen voor je pannenkoek, kindvriendelijke
            voorzieningen en een terras bij het water
          </p>
          <h1>Status: restaurant gesloten</h1>
          <p class="middle-text">
            Het restaurant is niet meer open. Dubbel-Op sloot al definitief zijn
            deuren in maart 2013 na meer dan twintig jaar bestaan vanwege
            onenigheid tussen de uitbaters en de eigenaar van het pand. Omroep
            Flevoland Het pand stond daarna jarenlang leeg en is inmiddels
            gesloopt.
          </p>
          <h1>Wat is er nu?</h1>
          <p class="middle-text">
            De plek waar Dubbel-Op stond wordt nu ontwikkeld voor nieuwbouw van
            49 appartementen (projectnaam Green Hill), met verwachte oplevering
            in 2026.
          </p>
        </div>
      </div>
    </section>
    <!-- Bottom Section with Image and Text -->
    <section class="bottom-section">
      <img
        src="/src/assets/img/btn.png"
        alt="Bottom section image"
        class="bottom-image"
      />
      <p class="bottom-text">
        Backend: CROISSANT TEAM WINS — FINAL VICTORY 2025!!!
      </p>
    </section>
  </div>
</template>
<script setup lang="ts"></script>
<style>
:root {
  --body: hsla(304, 36%, 42%, 1);
  --title-text: hsl(0, 0%, 90%);
  --achtergrond-primair: hsl(0, 0%, 96%);
  --site-paars-xtra-light: hsla(304, 36%, 82%, 1);
  --site-paars-light: hsla(304, 36%, 52%, 1);
  --site-paars: hsla(304, 36%, 42%, 1);
  --interactief: hsl(41, 100%, 69%);
  --header-bg: rgba(255, 255, 255, 0.65);
  --header-shadow: rgba(0, 0%, 0.1);
  --font-primair: "Inter", Roboto, "Open Sans", Arial, Helvetica, sans-serif;
  --font-heading: "Montserrat", "Poppins", "Nunito", "Segoe UI",
    "Helvetica Neue", Arial, sans-serif;
  --font-mono: "Courier New", Courier, monospace;
  --font-smal: 9px;
  --font-grootte: 16px;
  --font-grootte2: 32px;
  --font-grootte3: 42px;
  --titel-font: sans-serif;
  --header-text: hsla(0, 0%, 11%, 1);
  --det-1: hsla(41, 100%, 49%, 0.8);
  --det-2: hsla(41, 100%, 59%, 0.8);
  --det-3: hsla(41, 100%, 69%, 0.8);
}
*,
*::before,
*::after {
  box-sizing: border-box;
}
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: var(--site-paars);
  font-family: var(--font-primair);
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overflow-y: auto;
}
body::-webkit-scrollbar {
  display: none;
}
</style>
<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 80px;
  background-color: transparent;
}
.header-top {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 2rem;
  z-index: 1000;
  background-image: linear-gradient(
    to right,
    var(--site-paars-xtra-light) 0%,
    var(--site-paars-xtra-light) 20%,
    var(--site-paars-xtra-light) 29.9999%,
    var(--header-bg) 30%,
    var(--header-bg) 70%,
    var(--header-bg) 100%
  );
  box-shadow: 0 4px 7px rgba(0, 0, 0, 0.5);
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  max-width: 100%;
  width: 100%;
}
.dubbeloproute-titel {
  font-family: var(--titel-font);
  font-size: var(--font-grootte2);
  font-weight: bold;
  text-transform: uppercase;
  margin: 0;
  color: rgb(54, 54, 54);
  cursor: default;
  flex-shrink: 0;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  justify-content: flex-end;
}
.logo-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.logo-link:hover {
  transform: scale(1.1);
}
.logo {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.contact-button,
.admin-button {
  text-decoration: none;
}
.adminKnop {
  padding: 10px 20px;
  background: var(--interactief);
  border-radius: 20px;
  border: 2px solid var(--interactief);
  cursor: pointer;
  transition: background-color 0.45s;
  font-weight: bold;
  color: #333;
}
.adminKnop:hover {
  background: #e5ad3f;
  transition: all 0.1s;
}
.contactKnop {
  padding: 10px 20px;
  background: var(--achtergrond-primair);
  border-radius: 20px;
  border: 2px solid var(--site-paars);
  cursor: pointer;
  transition: background-color 0.45s;
  font-weight: bold;
  color: var(--site-paars);
}
.contactKnop:hover {
  background: var(--site-paars);
  color: white;
  transition: all 0.1s;
}
.middle-section {
  padding: 0;
  background-color: transparent;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.middle-container {
  max-width: 1200px;
  width: 100%;
  margin: 2rem;
  padding: 4rem;
  background: linear-gradient(to bottom, #ffffff 0%, #f9f9f9 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}

.middle-image {
  max-width: 450px;
  height: auto;
  order: 2;
  flex-shrink: 0;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.middle-text {
  margin: 1rem 0;
  padding: 0;
  color: var(--site-paars);
  font-size: var(--font-grootte);
  text-align: left;
  order: 1;
  flex: 1;
  line-height: 1.8;
}
.bottom-section {
  padding: 2rem;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.bottom-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 1rem;
}
.bottom-text {
  margin: 0;
  padding: 1.5rem;
  color: var(--site-paars);
  font-size: var(--font-grootte2);
  font-weight: bold;
  border: 3px solid var(--site-paars);
  border-radius: 8px;
  text-align: center;
  background-color: var(--achtergrond-primair);
}
</style>
