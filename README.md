# CMS

## How to launch

```shell
npm --prefix public start -- --configuration cloudnord
npm --prefix functions run serve -- -c ../firebase.cloudnord.json -P cloudnord
```

## Configuration Firebase Function

Pour faire fonctionner les Firebase functions, vous devez définir cette configuration via la commande `npx firebase-tools functions:config:get`

```json
{
  "convention": {
    "edition": "2024",
    "enddate": "01/07/2024",
    "startdate": "01/01/2024"
  },
  "gdg": {
    "zipcode": "...",
    "tel": "...",
    "city": "...",
    "event": "DevLille",
    "address": "...",
    "accountantemail": "...@devlille.fr",
    "website": "https://"
  },
  "mail": {
    "to": "...@devlille.fr",
    "from": "...@devlille.fr",
    "cc": "...@devlille.fr",
    "enabled": "true",
    "signature": "L'équipe du DevLille",
    "fromname": "GDG Lille"
  },
  "hosting": {
    "baseurl": "https://partenaire.devlille.fr/"
  },
  "mailjet": {
    "api": "...",
    "private": "..."
  }
}
```
