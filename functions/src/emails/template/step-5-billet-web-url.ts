export default (billetWebUrl: string, edition: string) => ({
    subject: `Devfest Lille ${edition} : Lien pour récupérer vos billets`,
    body: `
Bonjour
<br><br>
Nous vous envoyons ce mail pour vous annoncer que vous pouvez à présent récupérer vos billets à cette adresse: ${billetWebUrl}.
<br><br>
Nous restons à votre disposition pour tout complément via l'adresse contact@gdglille.org.
<br><br>
Cordialement  
<br><br>
L'équipe du Devfest Lille ${edition}
    `
});
