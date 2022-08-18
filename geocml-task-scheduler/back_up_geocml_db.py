import psycopg2
import time
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
    back_up_timestamp = time.time()
    for table in table_cursor.fetchall():
        f = open('/home/kasm-user/DBBackups/{}/{}.sql'.format(back_up_time_stamp, table[2]), 'w')
        cursor.execute('SELECT * FROM {};'.format(table[2]))
        for row in cursor:
            f.write('INSERT INTO {} VALUES ("{}");'.format(table[2], row))
        f.close()
