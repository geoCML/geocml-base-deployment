import psycopg2
import time
from pathlib import Path
from task_logger import log

ignore_tables = ('spatial_ref_sys', 'geometry_columns', 'geography_columns')
ignore_schemas = ('pg_catalog', 'information_schema')

def backup_geocml_db():
    try:
        conn = psycopg2.connect(dbname='geocml_db',
                                user='postgres',
                                password='admin',
                                host='127.0.0.1',
                                port=5432)
    except psycopg2.OperationalError:
        log('Couldn\'t connect to geocml_db; is the postgresql service started?')
        return
    cursor = conn.cursor()
    cursor.execute('SELECT DISTINCT table_schema FROM information_schema.tables;')
    schemas = cursor.fetchall()
    back_up_timestamp = time.time()
    path_to_backup_dir = Path('/home/kasm-user/DBBackups/{}'.format(back_up_timestamp))
    path_to_backup_dir.mkdir(parents=True, exist_ok=True)
    delete_backup_dir = True
    
    for schema in schemas:
        if schema[0] in ignore_schemas:
            continue
        
        cursor.execute('SELECT * FROM information_schema.tables WHERE table_schema = \'{}\';'
                .format(schema[0]))
        tables = cursor.fetchall() 

        for table in tables:
            if table[2] in ignore_tables:
                continue

            delete_backup_dir = False

            # Write to schema file
            schema_file = open('/home/kasm-user/DBBackups/{}/schema:{}.{}.sql'.format(back_up_timestamp, schema[0], table[2]), 'w')

            if not schema[0] == 'public':
                cursor.execute('SELECT DISTINCT grantee FROM information_schema.role_table_grants WHERE table_schema = \'{}\''
                        .format(schema[0]))
                schema_owner = cursor.fetchall()
                schema_file.write('CREATE SCHEMA IF NOT EXISTS {} AUTHORIZATION {};\n'
                        .format(schema[0], schema_owner[0][0]))

            cursor.execute('SELECT column_name, udt_name FROM information_schema.columns WHERE table_name = \'{}\''
                    .format(table[2]))
            columns_and_datatypes = []
            for row in cursor:
                if len(row) == 3: # column has a constraint                   
                    columns_and_datatypes.append('{} {} {}'.format(row[0], row[1], row[2]))
                else:
                    columns_and_datatypes.append('{} {}'.format(row[0], row[1]))
            columns_and_datatypes = ', '.join(columns_and_datatypes)
            schema_file.write('CREATE TABLE IF NOT EXISTS {}.{} ({});\n'.format(schema[0], table[2], columns_and_datatypes))  
            cursor.execute('SELECT tableowner FROM pg_tables WHERE tablename = \'{}\''.format(table[2]))
            table_owner = cursor.fetchall()

            if schema[0] == 'public': # TODO: refactor this
                cursor.execute('SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE contype = \'p\' AND conrelid::regclass::text = \'{}\';'.format(table[2]))
            else:
                cursor.execute('SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE contype = \'p\' AND conrelid::regclass::text = \'{}.{}\';'.format(schema[0], table[2]))

            pk = cursor.fetchall()

            if len(pk) > 0: # catch for when there is no primary key set on the database table
                schema_file.write('ALTER TABLE {}.{} ADD {};\n'.format(schema[0], table[2], pk[0][0]))
            schema_file.write('ALTER TABLE {}.{} OWNER TO {};'.format(schema[0], table[2], table_owner[0][0]))
            schema_file.close()
             
            # Write to data file
            data_file = open('/home/kasm-user/DBBackups/{}/data:{}.{}.csv'.format(back_up_timestamp, schema[0], table[2]), 'w')
            cursor.copy_to(data_file, '{}.{}'.format(schema[0], table[2]), sep=',')
            data_file.close()

    if delete_backup_dir: # nothing to back up
        path_to_backup_dir.rmdir()
    cursor.close()
    conn.close()
