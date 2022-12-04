# lingrow
linGrow (Multilingual Families Lab, U of A)
/nTo get familiar with our app, please read User Manual.pdf first

---

# Testing

### `python manage.py test`

Launches backend api tests.

### `npm test (./lingrow_react/)`

Launches frontend tests. `npm install` may be required for all the dependencies.

# Deployment

## Backend

#### PostgreSQL Database Setup -
##### [Helpful tutorial for database setup](https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-20-04-quickstart)
1) Install postgresql `sudo apt install postgresql postgresql-contrib`
2) Start postgresql service `sudo systemctl start postgresql.service`
3) Switch over to postgres account `sudo -i -u postgres`
5) Create a new role `createuser --interactive`
6) Create a new database `createdb {db_name}`

#### Django REST Framework Deployment -
##### [Helpful video for backend deployment](https://www.youtube.com/watch?v=Sa_kQheCnds&ab_channel=CoreySchafer)

Pre-req: >= Python 3.7

###### Linux Instance
1) Create a linux instance
    i. Update the server `sudo apt-get update`, `sudo apt-get upgrade`
    ii. Install pip if not already installed `sudo apt-get install python3-pip`
    iii. Install venv if not already installed `sudo apt-get install python3-venv`

###### GitHub Repo
2) Clone the repo (switch to side branch `deployed-config`)

###### Environment Setup
3) Setup a virutal environment
4) Install the requirements `pip3 install -r requirements.txt`
5) Update settings.py file (`lingrow/lingrow/settings.py`)
    i. Update `ALLOWED_HOSTS` to include IPs of the linux server
6) Collect static files `python3 manage.py collectstatic`

###### Apache2 Setup
7) Install apache2 `sudo apt-get install apache2`
8) Install mod-wsgi `sudo apt-get install libapache2-mod-wsgi-py3`
9) Update apache2 config
    i. Go to `/etc/apache2/sites-available/`
    ii. Make a copy of defualt config `sudo cp 000-default.conf {config_name}.conf`
    iii. Open up the newly create `{config_name}.conf` file
    iv. Add the following to the bottom before `</VirtualHost>`
    ```
    Alias /static {directory_to_static files} (eg. /home/user/lingrow/lingrow/static)
    <Directory {directory_to_static files}>
        Require all granted
    </Directory>

    <Directory {directory_to_wsgi.py} (eg. /home/user/lingrow/lingrow/lingrow)>
        <Files wsgi.py>
                Require all granted
        </Files>
    </Directory>

    WSGIScriptAlias / {path_to_wsgi.py} (eg. /home/user/lingrow/lingrow/lingrow/wsgi.py)
    WSGIDaemonProcess django_app python-path={path_to_project} (eg. /user/ubuntu/lingrow/lingrow) python-home={path_to_venv} (eg. /home/user/lingrow/venv)
    WSGIProcessGroup django_app
    ```
10) Enable the new configuration `sudo a2ensite {config_name}`

11) Disable the default config `sudo a2dissite 000-default.conf`
12) Grant permissions to the project folder
    i. `sudo chown :www-data {project_directory} (eg. /home/user/lingrow)`
    ii. `sudo chmod 775 {project_directory} (eg. /home/user/lingrow)`

###### Config File
13) Create a json config file at a secure location (eg. `/etc/config/json` )
    i. Add the following to the config file to be used in `settings.py`
    ```
    {
        "SECRET_KEY": "{a long secure key}",
        "EMAIL_USER": "{email address for sending emails}",
        "EMAIL_PASS": "{very secure password for email account}",
        "EMAIL_FROM": "{email address for sending emails}",
        "DB_NAME": "{database name}",
        "DB_USER": "{database user}",
        "DB_USER_PASS": "{a very secure password for the database user}"
    }
    ```

###### Server Restart
14) Restart the apache2 serivce `sudo service apache2 restart`
15) The server will be up and running
16) Example to access the api endpoints `{server_ip}/api/docs/` (can be an IPv4 or IPv6 address, note- don't forget to enclose IPv6 address in `[]` !)
