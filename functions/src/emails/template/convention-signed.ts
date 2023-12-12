export default (company: any, adress_cms4devfest: string, edition: string) => ({
  subject: `Devfest Lille ${edition} : Convention Signée`,
  body: `
Bonjour
<br><br>
Nous avons bien reçu votre convention signée et nous vous remercions pour votre réactivité.
<br><br>
L'étape suivante consiste réaliser le virement indiqué sur le devis disponible sur votre espace dédié : ${adress_cms4devfest}
<br><br>
Une fois cette étape terminée, nous pourrons commencer la communication de notre partenariat sur les réseaux sociaux. 
<br><br>
Nous restons à votre disposition pour tout complément via l'adresse contact@gdglille.org.
<br><br>
Cordialement  
<br><br>
L'équipe du Devfest Lille ${edition}
    `,
});