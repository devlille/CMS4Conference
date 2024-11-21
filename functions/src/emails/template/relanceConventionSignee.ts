import { Configuration } from '../../model';

export default (company: Record<string, any>, configuration: Configuration) => {
  return {
    subject: `Partenariat ${configuration.gdg.event} ${configuration.convention.edition}: Relance Convention à Signer`,
    body: `
    Bonjour
    <br><br>
    Nous vous envoyons cet email afin de vous annoncer que nous sommes toujours dans l'attente de votre signature pour la convention de partenariat pour ${configuration.gdg.event}.
    <br><br>
    Une fois signée, vous pouvez nous la retourner par email, ou la sauvegarde sur votre espace dédié.
    <br><br>
    Nous restons à votre disposition pour tout complément via l'adresse email ${configuration.mail.from}.
    <br><br>
    Cordialement     
    <br><br>
    ${configuration.mail.signature} ${configuration.convention.edition}
        `
  };
};
