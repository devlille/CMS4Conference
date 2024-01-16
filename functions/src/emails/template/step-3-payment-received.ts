import { Settings } from "../../model";

export default (company: any, id: string, settings: Settings) => {
  const adress_cms4devfest= `${settings.hosting.baseurl}/partner/${id}`;

  return {
    subject: `${settings.gdg.event} ${settings.convention.edition} : Place à la communication de notre partenariat`,
    body: `
  Bonjour
  <br><br>
  Nous avons bien reçu votre paiement et nous vous remercions pour votre réactivité.
  <br><br>
  L'étape suivante consiste à annoncer notre partenariat sur le site ${settings.gdg.event} et sur les réseaux sociaux. Pour cela nous vous invitons à compléter les informations suivantes sur votre espace dédié : ${adress_cms4devfest}
  <br>
  * Votre logo au format SVG.
  <br>
  * Une idée, un message à véhiculer pour l'annonce de notre partenariat sur les réseaux sociaux (facultatif)
  <br><br>
  Une fois cette étape terminée, nous reviendrons vers vous pour vous tenir informé de l'avancement global de l'organisation du Devfest Lille ${settings.convention.edition} et surtout pour vous accompagner dans votre préparation pour l'évènement. 
  <br><br>
  Nous restons à votre disposition pour tout complément via l'adresse ${settings.mail.from}.
  <br><br>
  Cordialement  
  <br><br>
  ${settings.mail.signature} ${settings.convention.edition}
      `,
  };
};
