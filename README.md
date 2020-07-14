###Prerequisites
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
Per creare un utente:
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
- `python manage.py migrate`
- `python manage.py makemigrations`
- `python manage.py createsuperuser` (just username and password, email blank)

then http://127.0.0.1:8000/admin/
- go in `Django OAuth Toolkit/Applications`
- Client id: `4mOLHPfJL0zueHOlawvJXsdnImpjOv3PmLdmm3NT`
- User: `1`
- Client type: `Confidential`
- Authorization grant type: `Resource owner password-based`
- Client secret: `FW4dYuZsLmE6PQHk7qrPAc4shQhdx2hknqNOh58XO3JQ6PFI8um2z6wyJubxF6hKNOOOJfZUQ67jm5ApN5HJioq4XsNAGSbCLiQZqrqfo6jiy67ddpvMOl3Be8SATFSL`
- `Save`


### Back Ground Tasks
Sono necessari __celery__, il motore che esegue in background i tasks e __redis__ che si occupa di gestire le comunicazioni tra django e celery.
Package necessari li trovi in `requirements.txt`


### Redis
Per installare redis bisogna installare il server `sudo apt install redis-server`
Bisogna lanciare redis-server prima di poter lanciare tasks tramite  `redis-server`
Nel caso la porta di default `6379` fosse occupata si può selezionare un'altra porta con `--port 6380`


### Celery
Per installare celery sono sufficienti i packages e le impostazioni messe nei vari files.
Per far partire celery, prima di lanciare tasks: `celery worker -A init_test --loglevel=info`


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
- `npm run dev` per far partire il server che si occupa dell'*hot reload*; sostanzialmente è possibile lavorare sulle 
pagine web con REACT ed al salvataggio le pagine che sono mostrate nel browser si refreshano atuomaticamente
