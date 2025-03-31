pour lancer le bot il suffit de faire :
- `node index.js`

pour crée les commandes slash (exemple :/ping) il faut lancer :
- `node deploy-command.js`

ca lit tout les scripts dans le folder "scripts" et pousse "data" (dans les scripts) dans discord.

pour le moment le bot a 4 commandes slash
- ping (pong) (/ping)
- qui est en lice pour etre bannis de clash royale (/kohlanta)
- combien de pognon "le joueur que l'on recherche" a utilisé dans clash royale (/pognon <tag d'un joueur>)
- tous les tags des joueurs du clan (vas de paire avec pognon) (/tags) 
- Qui sont les 5 plus gros donneurs (/genereux)

Ne pas oublié de renommer config-vanillia.json en config.json et le remplir

```json
{
  "token": "",
  "clientId": "",
  "guildId": "",
  "clash_token" : "",
  "channel_all": "",
  "channel_chef": "",
  "channel_test": ""
}
```
- token: le token du bot (une sorte de jwt en beacoup plus court)
- clientid: le numero de série du bot (PAS le oauth2) (serie de chiffre)
- guildId: l'id du serveur (click droit sur le server et copier l'id) (serie de chiffre)
- clash_token: la clé généré pas l'api clash royale (c'est un jwt)
- channel_all: discord -> click droit sur le channel copier l'id (c'est le channel ou tout le monde peux parler) (serie de chiffre)
- channel_chef: c'est le channel ou seul les chef peuvent parler (serie de chiffre)
- channel_test: un channel de test ou on peux tester les messages (serie de chiffre)

Dans l'absolu on peux mettre n'importe quel channel... les noms ce sont les miens...

Le code de "pognon", "send-message-ban", bans.js est tres moche. J'ai légèrement factoriser le code mais rien de folichon.

soyez indulgent merci :)

## Script en mode cron

Pour le moment il y a 3 scripts en mode cron
- send-message-ban => meme code que le script ban.js mais adapter pour le cron
- send-message-cube => envois juste un message dans un channel pour un rappel.
- send-message-getclan => fait un snapshot du clan le vendredi a 17h59 (permet de savoir qui est arrivé apres)