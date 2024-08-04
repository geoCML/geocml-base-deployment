ln -s /Persistence/geocml-project.qgz /usr/lib/cgi-bin/geocml-project.qgz
service apache2 start
cd /var/www/html/ && python3 manage.py makemigrations
cd /var/www/html/ && python3 manage.py migrate
cd /var/www/html/ && python3 manage.py collectstatic --noinput
cd /var/www/html/ && python3 manage.py runserver --verbosity 3
