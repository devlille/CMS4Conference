import { addDays } from "date-fns";
import { Timestamp } from "@google-cloud/firestore";
import { DocumentData } from "firebase-admin/firestore";
import { Settings } from "../../model";

export default ({ sponsoring, creationDate }: DocumentData, id: string, settings: Settings) => {
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const date = addDays((creationDate as Timestamp).toDate(), 15);
  const dateTimeFormat = new Intl.DateTimeFormat("fr-FR", options as any);

  const sponsor_reservation_end_date = dateTimeFormat.format(date);

  const address_cms4devfest = `${settings.hosting.baseurl}/partner/${id}`;

  return {
    subject: `Partenariat ${settings.gdg.event} ${settings.convention.edition}: Contrat et facture à acquitter`,
    body: `
  Bonjour
  <br><br>
  Vous trouverez la convention pour ce partenariat à nous retourner signée ainsi que la facture proforma à acquitter sur votre espace dédié ${address_cms4devfest}. 
  <br><br>
  Vous pouvez nous faire parvenir la convention soit en retour de ce mail, soit en la transférant sur votre espace dédié.
  <br><br>
  Ce pack ${sponsoring} vous est reservé jusqu'au ${sponsor_reservation_end_date}. Vous devez ainsi envoyer à minima la convention signée avant cette date.
  <br><br>
  Une fois la convention signée et le paiement reçu, nous passerons à la prochaine étape du partenariat.
  <br><br>
  Nous restons à votre disposition pour tout complément via l'adresse email ${settings.mail.from}.
  <br><br>
  Cordialement     
  <br><br>
  ${settings.mail.signature} ${settings.convention.edition}
      `,
  };
};
