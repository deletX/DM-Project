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
- `CREATE EXTENSION postgis;`


### Creazione del venv
- `virtualenv -p python3.6 venv`
- `source venv/bin/activate`
- `pip install -r requirements.txt`

Oppure:

In Pycharm entrare nel menu impostazioni (Ctrl+Alt+S), sotto Project > Project Interpreter, rotellina a fianco di Project Interpreter. Cliccare su Add e poi su OK
Per installare le dipendenze necessarie, tramite la finestra del terminale (in basso) eseguire:`


###Django
- `python manage.py makemigrations`
- `python manage.py migrate`
- `python manage.py createsuperuser` (just username and password, email blank)

then http://127.0.0.1:8000/admin/
- go in `Django OAuth Toolkit/Applications`
- Client id: `4mOLHPfJL0zueHOlawvJXsdnImpjOv3PmLdmm3NT`
- User: `1`
- Client type: `Confidential`
- Authorization grant type: `Resource owner password-based`
- Client secret: `FW4dYuZsLmE6PQHk7qrPAc4shQhdx2hknqNOh58XO3JQ6PFI8um2z6wyJubxF6hKNOOOJfZUQ67jm5ApN5HJioq4XsNAGSbCLiQZqrqfo6jiy67ddpvMOl3Be8SATFSL`
- `Save`

finally
- python manage.py runserver

or in Pycharm AddConfiguration -> add new -> djangoServer -> save -> run



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
