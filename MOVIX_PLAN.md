# MOVIX Platform

## Vizija

MOVIX je višekorisnička platforma za:

- kurirske službe
- transportne firme
- selidbe
- šlep službe
- druge logističke i uslužne firme

Prva firma koja će koristiti sistem je S011.

Svaka firma mora imati potpuno odvojene:

- korisnike
- kurire
- klijente
- zahteve
- dostave
- cene
- statistiku
- podešavanja

Klijenti će kasnije imati sopstveni nalog i aplikaciju preko koje šalju zahteve, čuvaju adrese i pregledaju istoriju.

---

## Trenutno završeno

- React i Vite projekat
- Node.js razvojno okruženje
- Git instaliran
- Osnovna struktura projekta
- Folder `components`
- `Sidebar.jsx`
- `Header.jsx`
- `Dashboard.jsx`
- `CompanyProfile.jsx`
- `Requests.jsx`
- Osnovni Dashboard izgled
- Osnovni profil firme S011
- Probna tabela zahteva
- CSS bez prijavljenih grešaka
- Supabase baza podataka povezana
- Tabela companies
- Tabela users
- Tabela clients
- Tabela client_addresses
- Tabela client_contacts
- Povezane foreign key veze između tabela
- Podržan multi-company model
---

## Važna napomena

Trenutni podaci su samo probni i ručno upisani u kod.

Još nisu urađeni:

- baza podataka
- pravi korisnički nalozi
- login
- registracija firmi
- zaštita podataka između firmi
- navigacija između stranica
- čuvanje zahteva
- uređivanje i brisanje podataka
- dodela kurira
- stvarna statistika
- mobilna aplikacija
- objavljivanje sistema

---

## Redosled razvoja

### Faza 1 — Temelj projekta

- [x] Kreiranje React projekta
- [x] Osnovne komponente
- [x] Početni vizuelni prototip
- - [x] Pokretanje Git repozitorijuma
- [x] Prva sačuvana verzija projekta
- [x] GitHub nalog
- [x] GitHub repozitorijum
- [x] Projekat poslat na GitHub
- [ ] Izbor baze podataka
- [x] Definisanje strukture podataka
- [x] Definisanje više nezavisnih firmi

### Faza 2 — Bezbednost i korisnici

- [ ] Login
- [ ] Registracija firme
- [ ] Korisničke uloge
- [ ] Administrator platforme
- [ ] Vlasnik firme
- [ ] Dispečer
- [ ] Kurir
- [ ] Klijent
- [ ] Odvajanje podataka svake firme

### Faza 3 — Osnovna navigacija

- [ ] Dashboard stranica
- [ ] Zahtevi stranica
- [ ] Dostave stranica
- [ ] Kuriri stranica
- [ ] Klijenti stranica
- [ ] Firma stranica
- [ ] Statistika stranica
- [ ] Podešavanja stranica

### Faza 4 — Poslovni moduli

- [ ] Unos zahteva
- [ ] Čuvanje zahteva u bazi
- [ ] Pretvaranje zahteva u dostavu
- [ ] Dodela kurira
- [ ] Statusi dostave
- [ ] Vreme preuzimanja
- [ ] Vreme isporuke
- [ ] Plaćanje
- [ ] Obračun kurira
- [ ] Izveštaji i statistika

### Faza 5 — Klijentski sistem

- [ ] Klijentski nalog
- [ ] Čuvanje čestih adresa
- [ ] Slanje zahteva
- [ ] Istorija dostava
- [ ] Praćenje statusa
- [ ] Obaveštenja

### Faza 6 — Kasnije proširenje

- [ ] Transport
- [ ] Selidbe
- [ ] Šlep službe
- [ ] Javni izbor ponuđača
- [ ] Mobilne aplikacije
- [ ] Plaćanja
- [ ] Objavljivanje platforme

---

## Sledeći konkretan korak
Sledeći konkretan korak:

- Napraviti tabelu deliveries
- Dizajnirati kompletan tok jedne dostave
- Povezati klijenta, adresu i kontakt sa dostavom