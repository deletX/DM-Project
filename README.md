### Prerequisites
- `sudo apt install git-all`
- `sudo apt install gcc`
- `sudo snap install node --classic --channel=12`
verify with
- `npx -v`
- `npm -v`
- `node -v`
- `sudo apt-get install python3-dev`


### PostgreSQL
- `sudo apt-get install wget ca-certificates`
- `wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -`
- `sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt bionic-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'`
- `sudo apt-get update`
- `sudo apt-get install postgresql-11 postgresql-11-postgis-3 postgresql-server-dev-11 python-psycopg2`


### GEOS, PROJ, GDAL
[In questa pagina](https://docs.djangoproject.com/en/3.0/ref/contrib/gis/install/geolibs/) si possono trovare tutte le info per installare queste librerie. 
- `sudo apt-get install binutils libproj-dev gdal-bin`


### Crezione db ed utente:
- `sudo -i -u postgres`
- `createdb dmproject`
- `psql dmproject`
- `CREATE USER django WITH PASSWORD 'django_tete_c';`
- `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO django;`
- `ALTER USER django CREATEDB;`
- `ALTER USER django SUPERUSER;`
- `CREATE EXTENSION postgis;`


### Creazione del venv
- `virtualenv -p python3.6 venv`
- `source venv/bin/activate`
- `pip install -r requirements.txt`

(Se ci sono problemi con il modulo assicurarsi di avere installato python3.6-dev)

Oppure:

In Pycharm entrare nel menu impostazioni (Ctrl+Alt+S), sotto Project > Project Interpreter, rotellina a fianco di Project Interpreter. Cliccare su Add e poi su OK
Per installare le dipendenze necessarie, tramite la finestra del terminale (in basso) eseguire:`


### Django
- `python manage.py makemigrations`
- `python manage.py migrate`
- `python manage.py createsuperuser` (just username and password, email blank)

then:
- python manage.py runserver YOUR_IP:8000

or in Pycharm AddConfiguration -> add new -> djangoServer -> save -> run

finally http://YOUR_IP:8000/admin/
- go in `Django OAuth Toolkit/Applications`
- Client id: `4mOLHPfJL0zueHOlawvJXsdnImpjOv3PmLdmm3NT`
- User: `1`
- Client type: `Confidential`
- Authorization grant type: `Resource owner password-based`
- Client secret: `FW4dYuZsLmE6PQHk7qrPAc4shQhdx2hknqNOh58XO3JQ6PFI8um2z6wyJubxF6hKNOOOJfZUQ67jm5ApN5HJioq4XsNAGSbCLiQZqrqfo6jiy67ddpvMOl3Be8SATFSL`
- `Save`


###Add postgres DB to settings.py
```bash
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'dmproject',
        'USER': 'django',
        'PASSWORD': 'django_tete_c',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

###Connect to postgres DB with pgAdmin III
- https://www.pgadmin.org/download/
- On start page: File/Add Server then fill Properties with these values:
```bash
Name: dmproject
Host: localhost
Port: 5432
Service:
Maintenance DB: postgres
Username: django
Password: django_tete_c
Group: Servers
```


### Back Ground Tasks
Sono necessari __celery__, il motore che esegue in background i tasks e __redis__ che si occupa di gestire le comunicazioni tra django e celery.
Package necessari li trovi in `requirements.txt`


### Redis
Importante: far partire redis e celery prima di ogni altra cosa
- `sudo apt install redis-server`
- `redis-server --port 6380`

Per installare redis bisogna installare il server `sudo apt install redis-server`
Bisogna lanciare redis-server prima di poter lanciare tasks tramite  `redis-server`
Nel caso la porta di default `6379` fosse occupata si può selezionare un'altra porta con `--port 6380`


### Celery
- `celery worker -A dmproject --loglevel=info`
Per installare celery sono sufficienti i packages e le impostazioni messe nei vari files.
Per far partire celery, prima di lanciare tasks: `celery worker -A dmproject --loglevel=info`

When process start you should see something like:

`[2020-07-15 14:48:46,275: INFO/ForkPoolWorker-3] Starting Driver Selection`

`[2020-07-15 14:48:46,290: INFO/ForkPoolWorker-3] Starting Mock APCA`

`[2020-07-15 14:49:16,305: INFO/ForkPoolWorker-3] Saving result into DB`

`[2020-07-15 14:49:16,316: INFO/ForkPoolWorker-3] Task api.tasks.mock_algorithm_task[2b0733a7-5ec2-41ad-8cf1-8df8321dbc85] succeeded in 30.092565850000028s: None`

### Social Auth
Bisogna fare la migrazione dopo aver installato i pacchetti


### Authentication REST
First get the token through google oauth through the front-end (no-idea how yet, but tested with oauth2 playground).
do a POST on `/api/v0.1/auth/convert-token` with data: `grant_type=convert_token&client_id=p4qU0b0ACHWcjajdkYrpihJykmQTW2TELTQupwXx&client_secret=zT15kpJMkkC5b6BtZhSc9VjmVPHVLuCedk3J2h0J29YtRWOkjTwbCQjfVwCP8OdZs26h9s4E6uidZJ9hf6d0AsJr2L2j1z8wQ1QWgihEEvlfDxXdBtPH2mXcZGhWsHPl&backend=google-oauth2&token=<token>`
This will return a `{"access_token":"<app-access-token>","expires_in":36000,"token_type":"Bearer","scope":"read write","refresh_token":"<app-refresh-token>"}`
Access token can be used to provide authorization including `Authorization: Bearer <app-access-token>` header in the request.


### REACT
- `cd react-fontend/`
- `npm install`
- `npm start` -> http://localhost:3000/
- be sure not to use http://127.0.0.1:3000/ or http://0.0.0.0:3000/ or http://YOUR_IP:3000 because Google Sign In won't work!


### Fake user (Alberto localhost)
- username: `mario`
- password: `marioRossi1*`


### React native
Split terminal vertically

First:
- `cd reactFrontendMobile/ && npm install`
- `cd reactFrontendMobile/ && npm start`

Second:
- `cd reactFrontendMobile/ && npx react-native run-android`

### RN set app icon
- https://medium.com/@ansonmathew/app-icon-in-react-native-ios-and-android-6165757e3fdb
- https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html#foreground.type=image&foreground.space.trim=1&foreground.space.pad=0.25&foreColor=rgba(96%2C%20125%2C%20139%2C%200)&backColor=rgb(255%2C%20255%2C%20255)&crop=0&backgroundShape=square&effects=none&name=ic_launcher


### RN Google Sign in
- https://dev.to/anwargul0x/get-started-with-react-native-google-sign-in-18i5
```bash
keytool -keystore /home/alberto/PycharmProjects/tete_c/reactFrontendMobile/android/app/debug.keystore -list -v
Enter keystore password: android
Alias name: androiddebugkey
Creation date: Dec 31, 2013
Entry type: PrivateKeyEntry
Certificate chain length: 1
Certificate[1]:
Owner: CN=Android Debug, OU=Android, O=Unknown, L=Unknown, ST=Unknown, C=US
Issuer: CN=Android Debug, OU=Android, O=Unknown, L=Unknown, ST=Unknown, C=US
Serial number: 232eae62
Valid from: Tue Dec 31 23:35:04 CET 2013 until: Wed May 01 00:35:04 CEST 2052
Certificate fingerprints:
         MD5:  20:F4:61:48:B7:2D:8E:5E:5C:A2:3D:37:A4:F4:14:90
         SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
         SHA256: FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C
Signature algorithm name: SHA1withRSA
Subject Public Key Algorithm: 2048-bit RSA key
Version: 3
Extensions: 
#1: ObjectId: 2.5.29.14 Criticality=false
SubjectKeyIdentifier [
KeyIdentifier [
0000: 0B F9 FE 38 89 D2 8A 9C   58 F0 C1 0A B7 0E 43 28  ...8....X.....C(
0010: D8 23 F3 20                                        .#. 
]
]
Warning:
The JKS keystore uses a proprietary format. It is recommended to migrate to PKCS12 which is an industry standard format using "keytool -importkeystore -srckeystore ./android/app/debug.keystore -destkeystore ./android/app/debug.keystore -deststoretype pkcs12".
```
- ``

### RN Problems
```bash 
PROBLEMS:
If you are sure the module exists, try these steps:
1. Clear watchman watches: watchman watch-del-all
2. Delete node_modules: rm -rf node_modules && rm package-lock.json && npm install --save
3. Reset Metro's cache: rm -rf /tmp/metro-*
4. Remove the cache: npx react-native start --reset-cache
5. Rebuild: npx react-native run-android
```

### Screen mirror with scrcpy
- install `scrcpy` with `Ubuntu Software`
- plug your phone with USB
- `ADB="/home/alberto/Android/Sdk/platform-tools/adb" scrcpy`
- `ADB="/home/stefano/Android/Sdk/platform-tools/adb" scrcpy`



### Problems with DB
- Remove postgres:
```bash 
$ dpkg -l | grep postgres
ii  pgdg-keyring                               2018.2                                           all          keyring for apt.postgresql.org
ii  postgresql-11                              11.8-1.pgdg18.04+1                               amd64        object-relational SQL database, version 11 server
ii  postgresql-11-postgis-3                    3.0.1+dfsg-2.pgdg18.04+1                         amd64        Geographic objects support for PostgreSQL 11
ii  postgresql-11-postgis-3-scripts            3.0.1+dfsg-2.pgdg18.04+1                         all          Geographic objects support for PostgreSQL 11 -- SQL scripts
ii  postgresql-client-11                       11.8-1.pgdg18.04+1                               amd64        front-end programs for PostgreSQL 11
ii  postgresql-client-common                   215.pgdg18.04+1                                  all          manager for multiple PostgreSQL client versions
ii  postgresql-common                          215.pgdg18.04+1                                  all          PostgreSQL database-cluster manager
ii  postgresql-server-dev-11                   11.8-1.pgdg18.04+1                               amd64        development files for PostgreSQL 11 server-side programming
```
```bash 
$ sudo apt-get --purge remove pgdg-keyring postgresql-11 postgresql-11-postgis-3 postgresql-11-postgis-3-scripts postgresql-client-11 postgresql-client-common postgresql-common postgresql-server-dev-11
```

```bash
$ dpkg -l | grep postgres
```

- then reinstall postgres, create superuser in django, make migrations in django and add application in `Django OAuth Toolkit/Applications`
https://www.liquidweb.com/kb/how-to-remove-postgresql/

### React native vector icons
This method has the advantage of fonts being copied from this module at build time so that the fonts and JS are always in sync, making upgrades painless.

Edit `android/app/build.gradle` ( NOT `android/build.gradle` ) and add the following:

`apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"`

To customize the files being copied, add the following instead:
```
project.ext.vectoricons = [
    iconFontNames: [ 'MaterialIcons.ttf', 'EvilIcons.ttf' ] // Name of the font files you want to copy
]

apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

## Google API error
Run these commands to clean caches

```
# NPM
watchman watch-del-all
npm cache clean

# Android, if you encounter `com.android.dex.DexException: Multiple dex files define Landroid/support/v7/appcompat/R$anim`, then clear build folder.
cd android
./gradlew clean
cd ..
```

## Testing
Se non già fatto eseguire nell'interfaccia di postgresql (vedi su)
- `ALTER USER django CREATEDB;`
- `ALTER USER django SUPERUSER;`

è possibile eseguire i test con `python manage.py test` o tramite l'interfaccia di pycharm. E' importante affinché i test funzionino che cartelle media e static siano setuppate. Per fare ciò eseguire:
- `npm run build` (dentro react-frontend)
- spostare la cartella `react-frontend/build` dentro la cartella principale di progetto
- `python manage.py collectstatic`

# Error numbering
**App errors**
- `001` Error in getting the refresh token
- `002` Error in deleting the participation for an event
- `003` Error in retrieving event details
- `004` Error while logging in with google Oauth
- `005` Error while logging in with username and password
- `006` Error while retrieving notifications
- `007` Error while reading the notification (setting `read` value)
- `008` Error while retrieving profile
- `009` Error while creating a car
- `010` Error while editing a car
- `011` Error while deleting a car
- `012` Error while getting the address from nominatim given lat and lon
- `013` Error while joining an event
- `014` Error while posting feedback
- `015` Error while deleting the event
- `016` Error while starting the computation
- `017` Error while retrieving events list
- `018` Error with the gps location


**Web errors**
- `019` Error while using the refresh token 
- `020` Error while logging in with google Oauth
- `021` Error while logging in with username and password
- `022` Error during signup
- `023` Error while retrieving notifications
- `024` Error while reading the notification (setting `read` value)
- `025` Error while retrieving profile
- `026` Error while changing the profile picture
- `027` Error while updating user data
- `028` Error while deleting user **[not used yet]**
- `029` Error while creating a car
- `030` Error while editing a car
- `031` Error while deleting a car
- `032` Error while retrieving the picture from google
- `033` Error while creating an event
- `034` Error while joining an event (after creation)
- `035` Error while deleting the event
- `036` Error while editing feedback
- `037` Error in deleting the participation for an event
- `038` Error while posting feedback
- `039` Error while starting the computation
- `040` Error in retrieving event details
- `041` Error while updating event
- `042` Error while retrieving events list
- `043` Error while joining an event
- `044` Error while retrieving positions (MapContainer)
- `045` Error while retrieving user position from browser
- `046` Error while retrieving selected position (with marker)
- `047` Error while retrieving non-user profile