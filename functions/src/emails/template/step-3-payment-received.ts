import { Configuration } from '../../model';

export default (company: unknown, id: string, configuration: Configuration) => {
  const adress_cms4devfest = `${configuration.hosting.baseurl}/partner/${id}`;

  return {
    subject: `${configuration.gdg.event} ${configuration.convention.edition} : Place à la communication de notre partenariat`,
    body: `
  Bonjour
  <br><br>
  Nous avons bien reçu votre paiement et nous vous remercions pour votre réactivité.
  <br><br>
  L'étape suivante consiste à annoncer notre partenariat sur le site ${configuration.gdg.event} et sur les réseaux sociaux. Pour cela nous vous invitons à compléter les informations suivantes sur votre espace dédié : ${adress_cms4devfest}
  <br>
  * Votre logo au format SVG.
  <br>
  * Une idée, un message à véhiculer pour l'annonce de notre partenariat sur les réseaux sociaux (facultatif)
  <br><br>
  Une fois cette étape terminée, nous reviendrons vers vous pour vous tenir informé de l'avancement global de l'organisation de l'évènement et surtout pour vous accompagner dans votre préparation pour l'évènement. 
  <br><br>
  Nous restons à votre disposition pour tout complément via l'adresse ${configuration.mail.from}.
  <br><br>
  Cordialement  
  <br><br>
  ${configuration.mail.signature} ${configuration.convention.edition}
      `
  };
};
