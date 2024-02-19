import Signature from "./signature";

export default `
# CONVENTION DE PARTENARIAT

**Entre les soussignés :**

L'association **Cloud Nord**, régie par la loi 1901, dont le siège social est à <%= GDG_CITY %>. Représentée par **Nicolas ZAGO** , en sa qualité de président d'une part,

Ci-après "L'Association".


Et d'autre part l'entreprise : **<%= COMPANY %>**, société inscrite sous le n° <%= SIRET %>, dont le siège social est **<%= COMPANY_ADDRESS %>, <%= COMPANY_CP %> - <%= COMPANY_CITY %>**. Représentée par **<%= CONTACT %>**, **<%= ROLE %>**.

Ci-après "le Partenaire". 


**Il a été convenu et arrêté ce qui suit :**


## I - OBJET DE LA CONVENTION

Cette convention est destinée à régir, de la manière la plus complète possible, la relation de partenariat conclue entre l'association et le partenaire, en vue principalement de l’organisation de l'évènement **<%= EVENT_NAME %> <%= EVENT_EDITION %>**.

Elle précise de façon non exhaustive les droits et les obligations principaux des deux contractants, étant entendu que ceux-ci peuvent évoluer au fil du temps conformément à l'article VI - Modifications ; l’objectif principal étant que le partenariat qui unit les deux parties se développe au maximum et dans le sens des intérêts de chacun.


## II - OBLIGATIONS DE L'ASSOCIATION


D’une manière générale, l'association s’engage à donner une forte visibilité du partenaire sur les supports de communication Internet de l’association :


<% CONSIDERATIONS.forEach(function(c){ %>
- <%= c %>    
<% }); %>
- Logo partenaire sur l'application mobile et sur le site web <%= GDG_WEBSITE %>
- Logo sur les écrans (salle conférence)
<% if (HAS_BOOTH === 'true') { %>
L'association s'engage à fournir une multiprise, une table et deux chaises pour le stand. Le reste du matériel sera à la charge du partenaire. 
<% } %>

Les obligations citées précédemment seront appliquées à la reception du paiement réalisé par le partenaire.


## III - OBLIGATIONS DU PARTENAIRE


Le partenaire s’engage en contrepartie à verser à l'association le montant suivant, en vue de la réalisation de l’objet de la convention : <%= SPONSORING_TEXT %> euros TTC (<%= SPONSORING_NUMBER %> €). Le paiement du montant sera fait selon les conditions suivantes : paiement à la signature de la convention de partenariat et dans un délai de 45 jours. Ce délai dépassé, nous serions dans l'obligation de rompre notre partenariat.

Comme indiqué sur le devis, vous trouverez ci-dessous les informations bancaires de l'association : 
- IBAN FR76 1627 5006  0008 0025 9063 339
- BIC CEPAFRPP627

<% if (HAS_BOOTH === 'true') { %>
Le partenaire s'engage à installer son stand le 9 octobre après-midi. Une équipe de sécurité sera présente la nuit pour surveiller la zone d'expositions. 

Le stand doit respecter les contraintes suivante : 
- ne pas dépasser 2.4m de hauteur sur la panneau du fond
- ne pas dépasser 1.2m de hauteur sur les côtés. 
<% } %>


## IV - DUREE DE LA CONVENTION


Le présent partenariat conclu entre l'association et partenaire débutera à la signature de la présente Convention et s’achèvera de plein droit et sans formalité le <%= END_DATE %>.


## V - RESILIATION


Chacune des parties pourra résilier la convention, de plein droit, à tout moment et sans préavis, au cas où l’autre partie manquerait gravement à ses obligations contractuelles. Cette résiliation devra être précédée d’une mise en demeure par lettre recommandée avec A/R restée sans effet durant 30 jours calendaires.

La résiliation à l’initiative du partenaire ne peut en aucun cas donner droit à la restitution de tout ou partie du montant versé par le partenaire lors de la signature de la présente convention, sauf en cas de résiliation liée à un manquement grave de l'Association.


## VI - ANNULATION 

L'association sera contrainte d'annuler l'évènement en cas de force majeure empêchant l'exécution de l'évènement dans le lieu d'accueil prévu initialement. Seront considérés comme cas de force majeure, les évènement qui respecteront les conditions de l'Article 1148 du Code Civil ou les évènement suivants : grève, lock-out, incendie, inondation, avarie de matériel, émeute, guerre, arrêt de force motrice, suspension des télécommunications. Il en est de même en cas de pandémie. Dans ce cas, l'association s'engage à reprogrammer l'évènement à une date ultérieure dans l'année qui suit. Le partenaire pourra alors choisir soit d'être remboursé totalement du montant défini dans la section III - OBLIGATIONS DU PARTENAIRE, soit de reconduire son partenariat à la date qui aura été reprogrammé par l'Association. 

## VII - MODIFICATIONS


A la demande de l’une ou l’autre partie, des modifications pourront être apportées à la présente convention moyennant accord écrit entre les parties. Ces modifications seront considérées comme étant des modalités complémentaires de la présente convention et en feront partie intégrante.


## VIII : CONFIDENTIALITE


Chacune des parties s’engage à considérer les dispositions de la présente convention comme étant confidentielles et à ne pas les communiquer à des tiers sans l’accord exprès et écrit de l’autre partie.


## IX : LITIGES


La présente Convention est soumise à la loi française. Les deux parties s’engagent à régler à l’amiable tout différent éventuel qui pourrait résulter de la présente convention. En cas d’échec, les tribunaux de Lille seront seuls compétents.


Fait à Lille le <%= DATE %> en deux exemplaires originaux

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L'association&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Le partenaire

${Signature}
`;
