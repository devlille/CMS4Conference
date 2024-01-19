import { Settings } from "../../model";

export default (settings: Settings) => ({
  subject: `Partenariat ${settings.gdg.event} ${settings.convention.edition}: RDV l'année prochaine ?`,
  body: `
Bonjour
<br><br>
Nous sommes dans le regret de vous annoncer que votre demande de partenariat pour ${settings.gdg.event} ${settings.convention.edition} n'a malheureusement pas pu être retenu. 
<br><br>
En effet, nous avons reçu énormément de demandes, et comme depuis le début de l'aventure ${settings.gdg.event}, les premiers partenaires ayant rempli le formulaire ont été les premiers validés. 
<br><br>
Nous restons à votre disposition pour tout complément via l'adresse email ${settings.mail.from}.
<br><br>
Cordialement     
<br><br>
${settings.mail.signature} ${settings.convention.edition}
    `,
});
