import {Settings} from "../../model";

export default (
    partner: Record<string, any>,
    settings: Settings
  ) => {
    return ({
      subject: `Partenariat ${settings.gdg.event} ${settings.convention.edition}: Relance Paiement`,
      body: `
    Bonjour
    <br><br>
    Nous vous envoyons cet email afin de vous annoncer que nous sommes toujours dans l'attente du paiement de la facture relative à notre partenariat pour le Devfest Lille.
    <br><br>
    Nous restons à votre disposition pour tout complément via l'adresse email ${settings.mail.from}.
    <br><br>
    Cordialement     
    <br><br>
    ${settings.mail.signature} ${settings.convention.edition}
        `,
    })
  };
  