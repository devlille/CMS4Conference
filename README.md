# CMS

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
    "event": "Devfest Lille",
    "address": "...",
    "accountantemail": "...@gdglille.org",
    "website": "https://"
  },
  "mail": {
    "to": "...@gdglille.org",
    "from": "...@gdglille.org",
    "cc": "...@gdglille.org",
    "enabled": "true",
    "signature": "L'équipe du Devfest Lille",
    "fromname": "GDG Lille"
  },
  "hosting": {
    "baseurl": "https://cms4partners.gdglille.org/"
  },
  "mailjet": {
    "api": "...",
    "private": "..."
  }
}
```
