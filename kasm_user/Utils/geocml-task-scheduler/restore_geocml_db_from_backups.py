import psycopg2
import os
from time import time
from task_logger import log

db_backups_path = '/home/kasm-user/DBBackups/'

def restore_geocml_db_from_backups():
    try:
        conn = psycopg2.connect(dbname='geocml_db',
                                user='postgres',
                                password='admin',
                                host='127.0.0.1',
                                port=5432)
    except psycopg2.OperationalError:
        log("Couldn't connect to geocml_db; is the postgresql service started?")
        return

    now = time()
    delta = float('inf') 
    most_recent_backup = ''
    for subdir in os.walk(db_backups_path):
        try:
            subdir_timestamp = float(subdir[0].split('/')[-1])
            if  now - subdir_timestamp < delta:
                delta = now - subdir_timestamp
                most_recent_backup = subdir[0]
        except ValueError:
            if not subdir[0] == db_backups_path:
                log("Found something unexpected in backup directory, skipping over: {}".format(subdir[0]))

    if most_recent_backup == '':
        log("No recent backups found. Aborting restoration process.")
        return 0

    log("Restoring geocml_db from {}".format(most_recent_backup))
    cursor = conn.cursor()
    for sql_backup_file in os.listdir(most_recent_backup):
        if sql_backup_file.split('.')[-1] == 'sql':
            log("Found SQL file {}".format(sql_backup_file))
            cursor.execute(open("{}/{}".format(most_recent_backup, sql_backup_file), 'r').read())
    conn.commit()
    cursor.close()
    conn.close()
    return 0
