service apache2 start
cd /var/www/html/ && python3 manage.py makemigrations
cd /var/www/html/ && python3 manage.py migrate
cd /var/www/html/ && python3 manage.py collectstatic --noinput
cd /var/www/html/ && python3 manage.py runserver --verbosity 3