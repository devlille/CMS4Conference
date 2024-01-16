import { Settings } from "../../model";

export default (partner: Record<string, any>, settings: Settings) => {
  return {
    subject: `Partenariat ${settings.gdg.event} ${settings.convention.edition}: Relance Informations Complémentaires`,
    body: `
    Bonjour
    <br><br>
    Nous vous envoyons cet email afin de vous annoncer que nous sommes toujours dans l'attente d'informations complémentaires afin d'établir la convention et la facture pour le Devfest Lille.
    <br><br>
    Vous pouvez renseigner ces informations sur votre espace dédié.
    <br><br>
    Nous restons à votre disposition pour tout complément via l'adresse email ${settings.mail.from}.
    <br><br>
    Cordialement     
    <br><br>
    ${settings.mail.signature} ${settings.convention.edition}
        `,
  };
};
