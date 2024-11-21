import { Configuration } from '../../model';

export default ({ sponsoring }: any, id: string, configuration: Configuration) => {
  const edition = configuration.convention.edition;
  const address_cms4devfest = `${configuration.hosting.baseurl}/partner/${id}`;
  return {
    subject: `Partenariat ${configuration.gdg.event} ${edition}: Informations Complémentaires à renseigner`,
    body: `
  Bonjour
  <br><br>
  Bonne nouvelle ! Votre demande de pack ${sponsoring} a été validée.
  <br><br>
  Vous trouverez sur votre espace personnel, un formulaire permettant de récupérer des informations complémentaires vous concernant :  ${address_cms4devfest}. 
  <br><br>
  Une fois les informations fournies, nous pourrons générer la convention et la facture.
  <br><br>
  Nous restons à votre disposition pour tout complément via l'adresse email ${configuration.mail.from}.
  <br><br>
  Cordialement     
  <br><br>
  ${configuration.mail.signature} ${edition}
      `
  };
};
