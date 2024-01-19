import { Settings } from "../../model";

export default ({ sponsoring }: any, id: string, settings: Settings) => {
  const adress_cms4devfest = `${settings.hosting.baseurl}/partner/${id}`;
  return {
    subject: `${settings.gdg.event} ${settings.convention.edition} : Demande de partenariat bien reçue`,
    body: `
  Bonjour
  <br><br>
  Nous avons bien pris connaissance de votre souhait de devenir partenaire ${settings.gdg.event} ${settings.convention.edition} et nous vous en remercions.
  <br><br>
  Etant donné la forte affluence des demandes de partenariat, nous reviendrons vers vous par email dans une dizaine de jours maximum pour vous valider la réservation du pack ${sponsoring} ou de votre choix de pack sponsor de replis le cas échéant.
  <br><br>
  Vous pouvez suivre l'avancement de votre demande sur votre espace dédié : ${adress_cms4devfest}
  <br><br>
  Nous restons à votre disposition pour tout complément via l'adresse email ${settings.mail.from}.
  <br><br>
  Cordialement 
  <br><br>
  ${settings.mail.signature} ${settings.convention.edition}
      `,
  };
};
