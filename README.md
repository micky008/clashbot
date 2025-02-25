pour lancer le bot il suffit de faire :
- `node index.js`

pour crée les commandes slash (exemple :/ping) il faut lancer :
- `node deploy-command.js`

ca lit tout les scripts dans le folder "scripts" et pousse "data" (dans les scripts) dans discord.

pour le moment le bot a 3 commandes slash
- ping (pong) (/ping)
- qui est en lice pour etre bannis de clash royale (/kohlanta)
- combien de pognon on a utiliser dans clash royale (/pognon <tag d'un joueur>)

Ne pas oublié de renommer config-vanillia.json en config.json et le remplir

```json
{
  "token": "",
  "clientId": "",
  "guildId": "",
  "clash_token" : "",
  "channel_all_id": "",
  "channel_chef": ""
}
```
- token: le token du bot (une sorte de jwt en beacoup plus court)
- clientid: le numero de série du bot (PAS le oauth2) (serie de chiffre)
- guildId: l''id du serveur (click droit sur le server et copier l''id) (serie de chiffre)
- clash_token: la clé généré pas l''api clash royale (c''est un jwt)
- channel_all_id: discord -> clickj droit sur le channel copier l''id (c''est le channel ou tout le monde peux parler (serie de chiffre)
- channel_chef: c''est le channel ou seul les chef peuvent parler (serie de chiffre)


