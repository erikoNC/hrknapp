# hrknapp

Tenkt flyt:

Lager en frontend der man kan fylle ut tittel, og evt. fritekst. Knappen blir kun en trigger for å ta webcam-bilde. Frontenden refreshes hver gang et bilde blir tatt. Når man er fornøyd med bildet, kan man trykke på en "Send"-knapp, og da spilles despacito.

## Lydkanal på raspberry
```
amixer cset numid=3 n
```
Hvor <n>n er lydutgang : 0=auto, 1=analog, 2=hdmi
