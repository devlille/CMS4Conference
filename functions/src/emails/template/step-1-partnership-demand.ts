import { Company, Configuration } from "../../model";

export default (
  { sponsoring, sponsoringOptions }: Company,
  id: string,
  configuration: Configuration
) => {
  let options = "";

  const length = ponsoringOptions?.length ?? 0;
  if (length > 0) {
    options = `
  A ce partenariat, les options suivantes seront ajoutées.<br>
  ${sponsoringOptions
    ?.map((option) => `- ${option.label} (${option.price} euros)`)
    .join("<br>")}
  `;
  }
  options += "<br></br>";
  const adress_cms4devfest = `${configuration.hosting.baseurl}/partner/${id}`;
  return {
    subject: `${configuration.gdg.event} ${configuration.convention.edition} : Demande de partenariat bien reçue`,
    body: `
  Bonjour
  <br><br>
  Nous avons bien pris connaissance de votre souhait de devenir partenaire ${configuration.gdg.event} ${configuration.convention.edition} et nous vous en remercions.
  <br><br>
  ${options}
  <br><br>
  Etant donné la forte affluence des demandes de partenariat, nous reviendrons vers vous par email dans une dizaine de jours maximum pour vous valider la réservation du pack ${sponsoring} ou de votre choix de pack sponsor de replis le cas échéant.
  <br><br>
  Vous pouvez suivre l'avancement de votre demande sur votre espace dédié : ${adress_cms4devfest}
  <br><br>
  Nous restons à votre disposition pour tout complément via l'adresse email ${configuration.mail.from}.
  <br><br>
  Cordialement 
  <br><br>
  ${configuration.mail.signature} ${configuration.convention.edition}
      `,
  };
};
