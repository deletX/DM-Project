#tete_c

#Initial PyCharm Setup
manca il file db.sqlite3 (non credo serva visto che userò PostreSQL) ed il venv.

##Creazione del venv
In Pycharm entrare nel menu impostazioni (Ctrl+Alt+S), sotto Project > Project Interpreter, rotellina a fianco di Project Interpreter. Cliccare su Add e poi su OK

Per installare le dipendenze necessarie, tramite la finestra del terminale (in basso) eseguire:`
pip3 install -r requirements.txt`

#Installazione GeoDJango
Per usare GeoDjango è necessario avere un DB che supporti oggeti geografici. Per fare questo implementiamo PostGIS che rende PostgreSQL un db spaziale.

Prima di installare PostGIS sono necessari GEOS, PROJ e GDAL

##GEOS, PROJ, GDAL
[In questa pagina](https://docs.djangoproject.com/en/3.0/ref/contrib/gis/install/geolibs/) si possono trovare tutte le info per installare queste librerie. 

`sudo apt-get install binutils libproj-dev gdal-bin`

## PosGIS 
###PostgreSQL
crea un file in `/etc/apt/sources.list.d` chiamato `pgdg.list` ed aggiungi questa riga: `deb http://apt.postgresql.org/pub/repos/apt/ bionic-pgdg main`

Esegui:
`wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -`

Installa postgreSQL ed altri packages tramite il comando:
`sudo apt-get install postgresql-11 postgresql-11-postgis-3 postgresql-server-dev-11 python-psycopg2`

####Crezione db ed utente:
Per creare un utente:
```
sudo -i -u postgres
createdb tete_c
psql tete_c
CREATE USER django WITH PASSWORD 'django_tete_c';
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO django;
CREATE EXTENSION postgis;
```

Bisognerà modificare le impostazioni in `settings.py`

```
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'gis',
        'USER': 'user001',
        'PASSWORD': '123456789',
        'HOST': 'localhost',
        'PORT': '5432'
    }
}
```
Bisognerà anche aggiungere GeoDjango alle app installate
```
INSTALLED_APPS = [
    # [...]
    'django.contrib.gis'
]
```

## Back Ground Tasks
Sono necessari __celery__, il motore che esegue in background i tasks e __redis__ che si occupa di gestire le comunicazioni tra django e celery.

Package necessari li trovi in `requirements.txt`
###redis
Per installare redis bisogna installare il server `sudo apt install redis-server`

Bisogna lanciare redis-server prima di poter lanciare tasks tramite  `redis-server`

Nel caso la porta di default `6379` fosse occupata si può selezionare un'altra porta con `--port 6380`

###celery
Per installare celery sono sufficienti i packages e le impostazioni messe nei vari files.

Per far partire celery, prima di lanciare tasks: `celery worker -A init_test --loglevel=info`


#Social Auth
Bisogna fare la migrazione dopo aver installato i pacchetti


#Authentication REST
First get the token through google oauth through the front-end (no-idea how yet, but tested with oauth2 playground).

do a POST on `/api/v0.1/auth/convert-token` with data: `grant_type=convert_token&client_id=p4qU0b0ACHWcjajdkYrpihJykmQTW2TELTQupwXx&client_secret=zT15kpJMkkC5b6BtZhSc9VjmVPHVLuCedk3J2h0J29YtRWOkjTwbCQjfVwCP8OdZs26h9s4E6uidZJ9hf6d0AsJr2L2j1z8wQ1QWgihEEvlfDxXdBtPH2mXcZGhWsHPl&backend=google-oauth2&token=<token>`

This will return a `{"access_token":"<app-access-token>","expires_in":36000,"token_type":"Bearer","scope":"read write","refresh_token":"<app-refresh-token>"}`

Access token can be used to provide authorization including `Authorization: Bearer <app-access-token>` header in the request.

