import { Configuration } from "../../model";

export default (date: string, configuration: Configuration) => {
  return {
    subject: `${configuration.gdg.event} ${configuration.convention.edition} : Votre programmation a été programmée`,
    body: `
  Bonjour
  <br><br>
  Nous vous envoyons ce mail pour vous annoncer que la communication liée à notre partenariat a été prévue pour le ${date}.
  <br><br>
  Nous restons à votre disposition pour tout complément via l'adresse ${configuration.mail.from}.
  <br><br>
  Cordialement  
  <br><br>
  ${configuration.mail.signature} ${configuration.convention.edition}
      `,
  };
};
