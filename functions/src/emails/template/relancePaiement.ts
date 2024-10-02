import { Configuration } from "../../model";

export default (partner: Record<string, any>, configuration: Configuration) => {
  return {
    subject: `Partenariat ${configuration.gdg.event} ${configuration.convention.edition}: Relance Paiement`,
    body: `
    Bonjour
    <br><br>
    Nous vous envoyons cet email afin de vous annoncer que nous sommes toujours dans l'attente du paiement de la facture relative à notre partenariat pour ${configuration.gdg.event}.
    <br><br>
    Nous restons à votre disposition pour tout complément via l'adresse email ${configuration.mail.from}.
    <br><br>
    Cordialement     
    <br><br>
    ${configuration.mail.signature} ${configuration.convention.edition}
        `,
  };
};
