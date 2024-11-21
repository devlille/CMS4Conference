import Logo from './logo';
import Signature from './signature';

export default `
${Logo}

<div style="font-size: 10px">
<div  style="text-align: right; font-size: 8px"><b>Date : <%= DATE %></b></div>

<div style="text-align: right; font-size: 8px"><b>FACTURE <%= INVOICE_NUMBER %></b></div>
<% if (PO) { %>
<div  style="text-align: right; font-size: 8px"><b>PO : <%= PO %></b></div>
<% } %>

<div  style="text-align: right; font-size: 8px"><b>Association Cloud Nord</b></div>

<div  style="text-align: right; font-size: 8px"><%= GDG_ADDRESS %></div>

<div  style="text-align: right; font-size: 8px"><%= GDG_CP %> <%= GDG_CITY %></div>

<div  style="text-align: right; font-size: 8px">RNA: W595037084</div>

<div  style="text-align: right; font-size: 8px">Email: <%= GDG_EMAIL %></div>
<div  style="text-align: right; font-size: 8px">Téléphone: <%= GDG_TEL %></div>
<div  style="text-align: right; font-size: 8px">Comptable: <%= GDG_ACCOUNTANT_EMAIL %></div>

<br> 

<div  style="text-align: right; font-size: 8px"><b>Destinataire</b></div>

<div  style="text-align: right; font-size: 8px"><%= COMPANY %></div>

<div  style="text-align: right; font-size: 8px"><%= COMPANY_ADDRESS %></div>

<div  style="text-align: right; font-size: 8px"><%= COMPANY_CP %> <%= COMPANY_CITY %></div>
<div  style="text-align: right; font-size: 8px">A l'attention de <%= COMPANY_PERSON %></div>

<br />

<table style="width: 100%; font-size: 8px" border="1">
<thead>
    <th><b>Date</b></th>
    <th><b>Désignation</b></th>
    <th><b>Montant</b></th>
</thead>
<tbody>
    <% for(var i=0; i < LINES.length; i++) { -%>
    <tr>
        <td><b><%= DATE %></b></td>
        <td><%= LINES[i].label %></td>
        <td><%= LINES[i].price %> € HT</td>
    </tr>
    <% } -%>
    <tr>
        <td></td>
        <td>TVA 0%</td>
        <td>0 €</td>
    </tr>
    <tr>
        <td></td>
        <td><b>Total</b></td>
        <td><b><%= SPONSORING_NUMBER %> € TTC</b></td>
    </tr>
</tbody>
</table>
<br>
<div style="font-size: 8px">
Facture arrêtée à la somme de <%= SPONSORING_NUMBER %>€ TTC.
TVA non applicable, article 261 du Code général des impôts.
</div>
<div style="font-size: 8px">
Paiement par virement (IBAN FR76 1627 5006  0008 0025 9063 339, BIC CEPAFRPP627) à réception de cette facture.
</div>

<div style="font-size: 8px"
En votre aimable règlement,
</div>
<div  style="text-align: right">Fait à <%= GDG_CITY %> le <%= DATE %>.</div>

<div  style="text-align: right">Cloud Nord</div>
</div>
<div  style="text-align: right">${Signature}</div>
`;
