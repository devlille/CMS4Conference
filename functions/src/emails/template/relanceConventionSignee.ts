import { Settings } from "../../model";

export default (company: Record<string, any>, settings: Settings) => {
  return {
    subject: `Partenariat ${settings.gdg.event} ${settings.convention.edition}: Relance Convention à Signer`,
    body: `
    Bonjour
    <br><br>
    Nous vous envoyons cet email afin de vous annoncer que nous sommes toujours dans l'attente de votre signature pour la convention de partenariat pour le Devfest Lille.
    <br><br>
    Une fois signée, vous pouvez nous la retourner par email, ou la sauvegarde sur votre espace dédié.
    <br><br>
    Nous restons à votre disposition pour tout complément via l'adresse email ${settings.mail.from}.
    <br><br>
    Cordialement     
    <br><br>
    ${settings.mail.signature} ${settings.convention.edition}
        `,
  };
};
