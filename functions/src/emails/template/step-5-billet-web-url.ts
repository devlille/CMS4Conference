import { Company, Configuration } from '../../model';

const generateEmailForSponsorWithoutStand = (billetWebUrl: string, configuration: Configuration) => {
  return {
    subject: `${configuration.gdg.event} ${configuration.convention.edition} : Lien pour récupérer vos billets`,
    body: `
  Bonjour
  <br><br>
  Nous vous envoyons ce mail pour vous annoncer que vous pouvez à présent récupérer vos billets à cette adresse: ${billetWebUrl}.
  <br><br>
  Nous restons à votre disposition pour tout complément via l'adresse ${configuration.mail.from}.
  <br><br>
  Cordialement  
  <br><br>
  ${configuration.mail.signature} ${configuration.convention.edition}
      `
  };
};
const generateEmailForSponsorWithStand = (billetWebUrl: string, configuration: Configuration) => ({
  subject: `${configuration.gdg.event} ${configuration.convention.edition} : Lien pour récupérer vos billets`,
  body: `
Bonjour
<br><br>
Nous vous envoyons ce mail pour vous annoncer que vous pouvez à présent récupérer vos billets à cette adresse: ${billetWebUrl}.
<br><br>
Vous pouvez également indiquer les activités (jeux, lots à gagner, ...) que vous avez prévu sur votre stand.
<br><br>
Nous restons à votre disposition pour tout complément via l'adresse ${configuration.mail.from}.
<br><br>
Cordialement  
<br><br>
${configuration.mail.signature} ${configuration.convention.edition}
    `
});

export default (company: Company, configuration: Configuration) => {
  const billetWebUrl = company.billetWebUrl ?? '';
  if (company.sponsoring === 'Platinium' || company.sponsoring === 'Gold' || company.sponsoring === 'Silver') {
    return generateEmailForSponsorWithStand(billetWebUrl, configuration);
  }
  return generateEmailForSponsorWithoutStand(billetWebUrl, configuration);
};
