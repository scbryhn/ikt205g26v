GitHub link:

Oppgave krav:
Kamera-integrasjon
✔ (5%) Permissions: Be om og håndtere tilgang til både kamera og enhetens bildegalleri.
✔ (10%) Capture & Pick: Brukeren skal kunne velge mellom å ta et nytt bilde direkte i appen, eller velge et eksisterende fra galleriet.
✔ (5%) Preview: Bildet skal vises til brukeren i notatvinduet ("staged") før brukeren bekrefter lagring/opplasting.

Storage & Validering
✔ (10%) Client-side Validation: Koden skal sjekke at filen er under 15MB og i formatene JPG, PNG eller WebP før opplastingen til Supabase starter.
✔ (10%) Supabase Upload: Sikker opplasting av bildet til Supabase Storage (Bucket) med unike filnavn (for å unngå overskriving av andres bilder).
✔ (5%) DB Linking: Lagre URL-en til det opplastede bildet i notat-tabellen, slik at det er knyttet til riktig notat.

UI/UX (Bilde & Feedback)
✔ (10%) Loading States: Implementere en progress bar eller spinner som viser at bildeopplasting pågår, og deaktivere lagre-knappen underveis.
✔ (10%) Aspect Ratio Handling: Bildene skal vises sammen med notatene i "Jobb Notater"-skjermen, og skal skalere pent (bildet skal ikke strekkes).
✔ (10%) Error Messaging: Appen skal gi tydelige feilmeldinger til brukeren dersom bildet er for stort, feil format, eller hvis opplastingen feiler.

Notifikasjoner
✔ (5%) System Permissions: Be om tillatelse fra OS-et til å sende varsler/notifikasjoner til brukeren.
✔ (5%) Lokal Trigger (Gir 5% av 15%): Appen sender et varsel kun til den som trykker "Lagre". Logikken kjøres i app-koden etter en vellykket supabase.insert.
✔ (5%) Content Injection: Notifikasjonen skal inneholde tittelen på det nye notatet (f.eks. "Nytt notat: [Notatets tittel]").
