export default (
  { sponsoring }: any,
  sponsor_reservation_end_date: string,
  address_cms4devfest: string,
  edition: string
) => ({
  subject: `Partenariat Devfest Lille ${edition}: Contrat et facture à acquitter`,
  body: `
Bonjour
<br><br>
Bonne nouvelle ! Votre demande de pack ${sponsoring} pour le Devfest Lille ${edition} a été validé.
<br><br>
Vous trouverez la convention pour ce partenariat à nous retourner signée ainsi que la facture proforma à acquitter sur votre espace dédié ${address_cms4devfest}. 
<br><br>
Vous pouvez nous faire parvenir la convention soit en retour de ce mail, soit en la transférant sur votre espace dédié.
<br><br>
Ce pack ${sponsoring} vous est reservé jusqu'au ${sponsor_reservation_end_date}. Vous devez ainsi envoyer à minima la convention signée avant cette date.
<br><br>
Une fois la convention signée et le paiement reçu, nous passerons à la prochaine étape du partenariat.
<br><br>
Nous restons à votre disposition pour tout complément via l'adresse email contact@gdglille.org.
<br><br>
Cordialement     
<br><br>
L'équipe du Devfest Lille ${edition}
    `,
});
