import { Configuration } from "../../model";

export default (configuration: Configuration) => ({
  subject: `Partenariat ${configuration.gdg.event} ${configuration.convention.edition}: RDV l'année prochaine ?`,
  body: `
Bonjour
<br><br>
Nous sommes dans le regret de vous annoncer que votre demande de partenariat pour ${configuration.gdg.event} ${configuration.convention.edition} n'a malheureusement pas pu être retenu. 
<br><br>
En effet, nous avons reçu énormément de demandes, et comme depuis le début de l'aventure ${configuration.gdg.event}, les premiers partenaires ayant rempli le formulaire ont été les premiers validés. 
<br><br>
Nous restons à votre disposition pour tout complément via l'adresse email ${configuration.mail.from}.
<br><br>
Cordialement     
<br><br>
${configuration.mail.signature} ${configuration.convention.edition}
    `,
});
