# Uputstvo i Komande za Postavljanje (Deployment) na Git

Ove komande će vam pomoći da postavite vaš projekat na Git repozitorijum kao što je GitHub, GitLab, ili Bitbucket.

**Važno:** Ove komande treba da kopirate i izvršite u vašem lokalnom terminalu, unutar direktorijuma projekta.

## Preduslovi

1.  **Git:** Potrebno je da imate instaliran Git na vašem računaru.
2.  **Git Repozitorijum:** Potrebno je da imate kreiran prazan repozitorijum na nekoj od platformi (npr. GitHub). Prilikom kreiranja, dobićete URL adresu repozitorijuma (npr. `https://github.com/vase-ime/ime-projekta.git`).

## Koraci i Komande

Pretpostavljamo da se nalazite u glavnom direktorijumu vašeg projekta.

1.  **Inicijalizujte Git repozitorijum (ako već niste):**
    Ova komanda kreira novi, lokalni Git repozitorijum u vašem projektu. Pokrenite je samo ako do sada niste koristili Git za ovaj projekat.
    ```bash
    git init
    ```

2.  **Povežite lokalni repozitorijum sa udaljenim (remote):**
    Ova komanda govori vašem lokalnom Gitu gde da šalje izmene. **Zamenite `<URL_REPOZITORIJUMA>`** sa URL-om koji ste dobili prilikom kreiranja repozitorijuma.
    ```bash
    git remote add origin <URL_REPOZITORIJUMA>
    ```
    *Primer:*
    `git remote add origin https://github.com/vase-ime/ime-projekta.git`

3.  **Dodajte sve fajlove za praćenje promena:**
    Ova komanda priprema sve fajlove u projektu za slanje. Tačka (`.`) označava "sve fajlove".
    ```bash
    git add .
    ```

4.  **Napravite "commit" (sačuvajte izmene):**
    Commit je kao snimak trenutnog stanja vaših fajlova. Potrebno je da mu date opisnu poruku.
    ```bash
    git commit -m "Početni commit"
    ```

5.  **Promenite ime glavne grane u `main` (preporučena praksa):**
    Novi Git repozitorijumi često koriste `main` kao podrazumevanu granu umesto `master`.
    ```bash
    git branch -M main
    ```

6.  **Pošaljite izmene na udaljeni repozitorijum:**
    Ova komanda konačno šalje vaše sačuvane izmene (`commit`) na platformu kao što je GitHub.
    ```bash
    git push -u origin main
    ```

Nakon ovoga, vaš kod će biti sigurno sačuvan na udaljenom Git repozitorijumu. Svaki sledeći put kada budete hteli da sačuvate izmene, ponavljaćete korake 3, 4 i 6 (samo `git push origin main`).
