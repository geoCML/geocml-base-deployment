import psycopg2
import os
from time import time
from task_logger import log

ignore_tables = ('spatial_ref_sys', 'geometry_columns', 'geography_columns')
ignore_schemas = ('pg_catalog', 'information_schema')

def backup_geocml_db():
    try:
        conn = psycopg2.connect(dbname='geocml_db',
                                user='postgres',
                                password='admin',
                                host='geocml-postgres',
                                port=5432)
    except psycopg2.OperationalError:
        log('Couldn\'t connect to geocml_db; is the postgresql service started?')
        return

    cursor = conn.cursor()
    cursor.execute('SELECT DISTINCT table_schema FROM information_schema.tables;')
    schemas = cursor.fetchall()
    back_up_timestamp = time()
    path_to_backup_dir = os.path.join(os.sep, 'DBBackups', str(back_up_timestamp))
    os.mkdir(path_to_backup_dir)
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
            schema_file_path = os.path.join(path_to_backup_dir, 'schema:{}.{}.sql'.format(schema[0], table[2]))
            schema_file = open(schema_file_path, 'w')

            if not schema[0] == 'public':
                cursor.execute('SELECT DISTINCT grantee FROM information_schema.role_table_grants WHERE table_schema = \'{}\';'
                        .format(schema[0]))
                schema_owner = cursor.fetchall()
                schema_file.write('CREATE SCHEMA IF NOT EXISTS {} AUTHORIZATION {};\n'
                        .format(schema[0], schema_owner[0][0]))

            cursor.execute('SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE contype = \'p\' AND conrelid::regclass::text LIKE \'%{}%\';'.format(table[2]))

            pk = cursor.fetchall()

            cursor.execute('SELECT column_name, udt_name FROM information_schema.columns WHERE table_name = \'{}\';'
                    .format(table[2]))

            columns_and_datatypes = []
            for row in cursor:
                if len(row) == 3: # column has a constraint                   
                    columns_and_datatypes.append('{} {} {}'.format(row[0], row[1], row[2]))
                else:
                    columns_and_datatypes.append('{} {}'.format(row[0], row[1]))
            columns_and_datatypes = ', '.join(columns_and_datatypes)

            if len(pk) > 0: # table has primary key (expected)
                schema_file.write('CREATE TABLE IF NOT EXISTS {}."{}" ({}, {});\n'.format(schema[0], table[2], columns_and_datatypes, pk[0][0]))
            else:
                schema_file.write('CREATE TABLE IF NOT EXISTS {}."{}" ({});\n'.format(schema[0], table[2], columns_and_datatypes))

            cursor.execute('SELECT tableowner FROM pg_tables WHERE tablename = \'{}\';'.format(table[2]))
            table_owner = cursor.fetchall()

            schema_file.write('ALTER TABLE {}."{}" OWNER TO {};'.format(schema[0], table[2], table_owner[0][0]))
            schema_file.close()
             
            # Write to data file
            data_file_path = os.path.join(path_to_backup_dir, 'data:{}.{}.csv'.format(schema[0], table[2]))
            data_file = open(data_file_path, 'w')
            cursor.copy_expert('COPY {}."{}" TO STDOUT WITH (FORMAT csv, DELIMITER \',\', HEADER FALSE);'.format(schema[0], table[2]), data_file)
            data_file.close()

    if delete_backup_dir: # nothing to back up
        path_to_backup_dir.rmdir()
    cursor.close()
    conn.close()
