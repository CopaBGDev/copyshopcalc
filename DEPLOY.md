# Uputstvo za Deployment

Ova Next.js aplikacija je konfigurisana za postavljanje (deployment) na Firebase App Hosting.

## Preduslovi

1.  **Node.js:** Potrebno je da imate instaliran Node.js na vašem računaru.
2.  **Firebase Nalog:** Potreban vam je Firebase nalog i kreiran Firebase projekat. Ako ga nemate, možete ga besplatno napraviti na [firebase.google.com](https://firebase.google.com/).

## Koraci za Deployment

1.  **Instalirajte Firebase CLI:**
    Ako nemate instaliran Firebase CLI (Command Line Interface), otvorite terminal i pokrenite sledeću komandu:
    ```bash
    npm install -g firebase-tools
    ```

2.  **Prijavite se na Firebase:**
    U terminalu, pokrenite komandu za prijavu na vaš Firebase nalog. Ovo će otvoriti prozor u pretraživaču gde treba da se ulogujete.
    ```bash
    firebase login
    ```

3.  **Povežite projekat sa Firebase-om (samo prvi put):**
    Ako ovo radite prvi put za ovaj projekat, potrebno je da ga povežete sa vašim Firebase nalogom. U terminalu, unutar direktorijuma vašeg projekta, pokrenite:
    ```bash
    firebase init apphosting
    ```
    Pratite uputstva da biste izabrali postojeći Firebase projekat ili kreirali novi.

4.  **Pokrenite Deployment:**
    Kada ste spremni za postavljanje aplikacije, pokrenite sledeću komandu u terminalu:
    ```bash
    firebase deploy --only apphosting
    ```

Firebase CLI će automatski build-ovati vašu Next.js aplikaciju i postaviti je na server. Nakon završetka, dobićete link do vaše aktivne aplikacije.

To je sve! Vaša aplikacija će biti dostupna online.
