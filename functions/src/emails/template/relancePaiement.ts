export default (
    partner: any,
    address_cms4devfest: string,
    edition: string
  ) => ({
    subject: `Partenariat Devfest Lille ${edition}: Relance Paiement`,
    body: `
  Bonjour
  <br><br>
  Nous vous envoyons cet email afin de vous annoncer que nous sommes toujours dans l'attente du paiement de la facture relative à notre partenariat pour le Devfest Lille.
  <br><br>
  Nous restons à votre disposition pour tout complément via l'adresse email contact@gdglille.org.
  <br><br>
  Cordialement     
  <br><br>
  L'équipe du Devfest Lille ${edition}
      `,
  });
  