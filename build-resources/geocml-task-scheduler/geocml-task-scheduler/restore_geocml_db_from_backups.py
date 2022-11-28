import psycopg2
import os
from time import time
from task_logger import log

db_backups_path = '/DBBackups/'

def restore_geocml_db_from_backups():
    try:
        conn = psycopg2.connect(dbname='geocml_db',
                                user='postgres',
                                password='admin',
                                host='geocml-postgres',
                                port=5432)
    except psycopg2.OperationalError:
        log('Couldn\'t connect to geocml_db; is the postgresql service started?')
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
                log('Found something unexpected in backup directory, skipping over: {}'.format(subdir[0]))

    if most_recent_backup == '':
        log('No recent backups found. Aborting restoration process.')
        return 0

    log('Restoring geocml_db from {}'.format(most_recent_backup))
    cursor = conn.cursor() 
    for sql_schema_file in os.listdir(most_recent_backup): # rebuild table schema
        if sql_schema_file.split(':')[0] == 'schema':
            log('Found SQL schema file {}'.format(sql_schema_file))
            cursor.execute(open('{}/{}'.format(most_recent_backup, sql_schema_file), 'r').read())

    conn.commit() # commit schema changes to the database before loading data from the CSV

    for csv_data_file in os.listdir(most_recent_backup): # load data from CSV backups
        file_name_split = csv_data_file.split(':')

        if file_name_split[0] == 'data':
            log('Found CSV data file {}'.format(csv_data_file))
            file_name_split = file_name_split[1].split('.') 
            cursor.copy_from(open('{}/{}'.format(most_recent_backup, csv_data_file), 'r'), 
                    '{}.{}'.format(file_name_split[0], file_name_split[1]),
                    sep=',') # TODO: all tables are empty after backup...

    conn.commit()
    cursor.close()
    conn.close()
    return 0
