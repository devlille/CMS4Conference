import { Settings } from "../../model";

export default ({ sponsoring }: any, id: string, settings: Settings) => {
  const edition = settings.convention.edition;
  const address_cms4devfest = `${settings.hosting.baseurl}/partner/${id}`;
  return {
    subject: `Partenariat ${settings.gdg.event} ${edition}: Informations Complémentaires à renseigner`,
    body: `
  Bonjour
  <br><br>
  Bonne nouvelle ! Votre demande de pack ${sponsoring} pour ${settings.gdg.event} ${edition} a été validé.
  <br><br>
  Vous trouverez sur votre espace personnel, un formulaire permettant de récupérer des informations complémentaires vous concernant :  ${address_cms4devfest}. 
  <br><br>
  Une fois les informations fournies, nous pourrons générer la convention et la facture.
  <br><br>
  Nous restons à votre disposition pour tout complément via l'adresse email ${settings.mail.from}.
  <br><br>
  Cordialement     
  <br><br>
  ${settings.mail.signature} ${edition}
      `,
  };
};
