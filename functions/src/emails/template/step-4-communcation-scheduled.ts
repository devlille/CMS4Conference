export default (date: string, edition: string) => ({
  subject: `Devfest Lille ${edition} : Votre programmation a été programmée`,
  body: `
Bonjour
<br><br>
Nous vous envoyons ce mail pour vous annoncer que la communication liée à notre partenariat a été prévue pour le ${date}.
<br><br>
Nous restons à votre disposition pour tout complément via l'adresse contact@gdglille.org.
<br><br>
Cordialement  
<br><br>
L'équipe du Devfest Lille ${edition}
    `,
});
