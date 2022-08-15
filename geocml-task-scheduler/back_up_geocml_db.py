import psycopg2
from datetime import datetime
from task_logger import log

def back_up_geocml_db():
    try:
        conn = psycopg2.connect(dbname='geocml_db', 
                                user='geocml',
                                password='geocml',
                                host='127.0.0.1',
                                port=5432)
    except psycopg2.OperationalError:
        log("Couldn't connect to geocml_db; is the postgresql service started?")
        return

    table_cursor = conn.cursor()
    table_cursor.execute('SELECT * FROM information_schema.tables WHERE table_schema = \'public\';')
    cursor = conn.cursor()
    for table in table_cursor.fetchall(): 
        f = open('/home/kasm-user/DBBackups/{}-{}.sql'.format(datetime.now(), table[2]), 'w') # TODO: dump these backups in a better location
        cursor.execute('SELECT * FROM {};'.format(table[2]))
        for row in cursor:
            f.write('INSERT INTO {} VALUES ("{}");'.format(table[2], row))
        f.close()
