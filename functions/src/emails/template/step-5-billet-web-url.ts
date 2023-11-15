import { DocumentData } from "@google-cloud/firestore";

const generateEmailForSponsorWithoutStand = (billetWebUrl: string, edition: string) => ({
  subject: `Devfest Lille ${edition} : Lien pour récupérer vos billets`,
  body: `
Bonjour
<br><br>
Nous vous envoyons ce mail pour vous annoncer que vous pouvez à présent récupérer vos billets à cette adresse: ${billetWebUrl}.
<br><br>
Nous restons à votre disposition pour tout complément via l'adresse contact@gdglille.org.
<br><br>
Cordialement  
<br><br>
L'équipe du Devfest Lille ${edition}
    `,
});
const generateEmailForSponsorWithStand = (billetWebUrl: string, edition: string) => ({
  subject: `Devfest Lille ${edition} : Lien pour récupérer vos billets`,
  body: `
Bonjour
<br><br>
Nous vous envoyons ce mail pour vous annoncer que vous pouvez à présent récupérer vos billets à cette adresse: ${billetWebUrl}.
<br><br>
Vous pouvez également indiquer les activités (jeux, lots à gagner, ...) que vous avez prévu sur votre stand.
<br><br>
Nous restons à votre disposition pour tout complément via l'adresse contact@gdglille.org.
<br><br>
Cordialement  
<br><br>
L'équipe du Devfest Lille ${edition}
    `,
});

export default (billetWebUrl: string, company: DocumentData, edition: string) => {
  if (company.sponsoring === "Platinium" || company.sponsoring === "Gold" || company.sponsoring === "Silver") {
    return generateEmailForSponsorWithStand(billetWebUrl, edition);
  }
  return generateEmailForSponsorWithoutStand(billetWebUrl, edition);
};
