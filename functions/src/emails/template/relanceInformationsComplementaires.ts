import { Company, Configuration } from '../../model';

export default (partner: Company, configuration: Configuration) => {
  return {
    subject: `Partenariat ${configuration.gdg.event} ${configuration.convention.edition}: Relance Informations Complémentaires`,
    body: `
    Bonjour
    <br><br>
    Nous vous envoyons cet email afin de vous annoncer que nous sommes toujours dans l'attente d'informations complémentaires afin d'établir la convention et la facture pour ${configuration.gdg.event}.
    <br><br>
    Vous pouvez renseigner ces informations sur votre espace dédié.
    <br><br>
    Nous restons à votre disposition pour tout complément via l'adresse email ${configuration.mail.from}.
    <br><br>
    Cordialement     
    <br><br>
    ${configuration.mail.signature} ${configuration.convention.edition}
        `
  };
};
