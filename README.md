# Sortify - sort your music with maximum efficiency
![JavaScript](https://img.shields.io/badge/-JavaScript-black?style=flat-square&logo=javascript)
![React](https://img.shields.io/badge/-React-black?style=flat-square&logo=react)
![SCSS](https://img.shields.io/badge/-SCSS-black?style=flat-square&logo=SASS)
![HTML5](https://img.shields.io/badge/-HTML5-black?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/-CSS3-black?style=flat-square&logo=css3)
![Axios](https://img.shields.io/badge/-Axios-black?style=flat-square&logo=axios)
![Heroku](https://img.shields.io/badge/-Heroku-black?style=flat-square&logo=heroku)
![Git](https://img.shields.io/badge/-Git-black?style=flat-square&logo=git)
![GitHub](https://img.shields.io/badge/-GitHub-black?style=flat-square&logo=github)

Sortify ist eine Web Applikation, die es ermöglicht ohne großen Aufwand neue Musik nach eigenen Präferenzen zu entdecken und somit personalisierte Spotify Playlists zu erstellen.

Entscheide dich für eine Kategorie, die dir zusagt, seien es deine Lieblings-Artists, -Genres oder Neuerscheinungen. Sortify liefert dir passend dazu eine Reihe von Song-Vorschlägen. Lausche und entdecke neue Musik, die du liebst und erstelle deine perfekte Playlist.

Für die Verwendung der App benötigst du lediglich einen Spotify Account.




## Installation

Klone das Repository
 ```sh 
 $ git clone
 ```

Gehe in den Projektordner
```sh
$ cd discofy_project
```

Installiere die notwendigen Pakete
```sh
npm install
```

### Benötigte Inhalte
1.[Registriere](https://developer.spotify.com/documentation/general/guides/app-settings) die App im [Spotify Dashboard](https://developer.spotify.com/dashboard/) um die Client-ID und Client Secret zu erhalten und die Redirect URI festzulegen.\
2.Erstelle eine .env-Datei mit folgenden Parametern in deinem Projektordner:

|Eigenschaft| Beschreibung  |
|--|--|
|REACT_APP_CLIENT_ID|ID der registrierten App|
|REACT_APP_CLIENT_SECRET|Schlüssel, der bei gesicherten Aufrufen an die Spotify-Konten und Web-API-Dienste übergeben wird|
|REACT_APP_AUTHORIZE_URL|Autorisierungsanfrage. Die Autorisierungs-URL ist ein Spotify-Endpunkt, der dem Benutzer einen Berechtigungsdialog anzeigt.|
|REACT_APP_REDIRECT_URL|Callback-Endpunkt für die Spotify-Authentifizierung. Stelle sicher, dass diese mit der Umleitungs-URL in der Spotify-API-Konsole übereinstimmt.|

### Konfiguration
Fülle die .env-Datei folgendermaßen aus
|Umgebungsvariable| Wert  |
|--|--|
|REACT_APP_CLIENT_ID|"Gib hier deine Client ID ein"|
|REACT_APP_CLIENT_SECRET|"Gib hier dein Client Secret ein"|
|REACT_APP_AUTHORIZE_URL|"https://accounts.spotify.com/authorize"|
|REACT_APP_REDIRECT_URL|"http://localhost:3000/redirect"|

### Starte die App
Starte die App im Entwickler-Modus mit
```sh
npm start
```

Öffne [http://localhost:3000](http://localhost:3000) um es im Browser zu sehen.
Die Seite wird neustarten, wenn du Änderungen vornimmst.

## Autoren

    

Marcus:
* [E-Mail](mawillus-tech@gmail.com)
