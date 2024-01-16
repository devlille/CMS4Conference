import { DocumentData } from "@google-cloud/firestore";
import {Settings} from "../../model";

const generateEmailForSponsorWithoutStand = (billetWebUrl: string, settings: Settings) => {
  return ({
    subject: `${settings.gdg.event} ${settings.convention.edition} : Lien pour récupérer vos billets`,
    body: `
  Bonjour
  <br><br>
  Nous vous envoyons ce mail pour vous annoncer que vous pouvez à présent récupérer vos billets à cette adresse: ${billetWebUrl}.
  <br><br>
  Nous restons à votre disposition pour tout complément via l'adresse ${settings.mail.from}.
  <br><br>
  Cordialement  
  <br><br>
  ${settings.mail.signature} ${settings.convention.edition}
      `,
  });
}
const generateEmailForSponsorWithStand = (billetWebUrl: string, settings: Settings) => ({
  subject: `${settings.gdg.event} ${settings.convention.edition} : Lien pour récupérer vos billets`,
  body: `
Bonjour
<br><br>
Nous vous envoyons ce mail pour vous annoncer que vous pouvez à présent récupérer vos billets à cette adresse: ${billetWebUrl}.
<br><br>
Vous pouvez également indiquer les activités (jeux, lots à gagner, ...) que vous avez prévu sur votre stand.
<br><br>
Nous restons à votre disposition pour tout complément via l'adresse ${settings.mail.from}.
<br><br>
Cordialement  
<br><br>
${settings.mail.signature} ${settings.convention.edition}
    `,
});

export default (company: DocumentData, settings: Settings) => {
  const billetWebUrl = company.billetWebUrl;
  if (company.sponsoring === "Platinium" || company.sponsoring === "Gold" || company.sponsoring === "Silver") {
    return generateEmailForSponsorWithStand(billetWebUrl, settings);
  }
  return generateEmailForSponsorWithoutStand(billetWebUrl, settings);
};
