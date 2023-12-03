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
Vous trouverez sur votre espace personnel, un formulaire permettant de récupérer des informations complémentaires vous concernant :  ${address_cms4devfest}. 
<br><br>
Une fois les informations fournies, nous pourrons générer la convention et la facture.
<br><br>
Nous restons à votre disposition pour tout complément via l'adresse email contact@gdglille.org.
<br><br>
Cordialement     
<br><br>
L'équipe du Devfest Lille ${edition}
    `,
});
