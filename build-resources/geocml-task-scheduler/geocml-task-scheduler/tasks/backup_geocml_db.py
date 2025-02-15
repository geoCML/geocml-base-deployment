import psycopg2
import os
import shutil
import subprocess
from time import time
from task_logger import log

ignore_tables = ("spatial_ref_sys", "geometry_columns", "geography_columns")  # TODO: https://github.com/geoCML/tabor/issues/7
ignore_schemas = ("pg_catalog", "information_schema")

def backup_geocml_db():
    try:
        conn = psycopg2.connect(dbname="geocml_db",
                                user="postgres",
                                password=os.environ["GEOCML_POSTGRES_ADMIN_PASSWORD"],
                                host="geocml-postgres",
                                port=5432)
    except psycopg2.OperationalError:
        log("Couldn\'t connect to geocml_db; is the postgresql service started?")
        return

    back_up_timestamp = time()
    path_to_backup_dir = os.path.join(os.sep, "Persistence", "DBBackups", str(back_up_timestamp))
    os.mkdir(path_to_backup_dir)
    delete_backup_dir = True

    # Write table schemata to .tabor file
    out = subprocess.run(["tabor", "write", "--db", "geocml_db",
                             "--username", "geocml", "--password", os.environ["GEOCML_POSTGRES_PASSWORD"],
                             "--host", "geocml-postgres",
                             "--file", os.path.join(path_to_backup_dir, "geocml_db.tabor")],
                             capture_output=True)

    if out.stderr:
        log("Failed to generate .tabor file {}".format(out.stderr))
        shutil.rmtree(path_to_backup_dir, ignore_errors=True)
        return

    cursor = conn.cursor()
    cursor.execute("""SELECT DISTINCT table_schema FROM information_schema.tables;""")
    schemas = cursor.fetchall()

    # Write table data to CSV file
    for schema in schemas:
        if schema[0] in ignore_schemas:
            continue

        cursor.execute(f"""SELECT * FROM information_schema.tables WHERE table_schema = '{schema[0]}';""")

        tables = cursor.fetchall()

        for table in tables:
            if table[2] in ignore_tables:
                continue

            delete_backup_dir = False

            data_file_path = os.path.join(path_to_backup_dir, "data:{}.{}.csv".format(schema[0], table[2]))
            data_file = open(data_file_path, "w")
            cursor.copy_expert(f"""COPY {schema[0]}."{table[2]}" TO STDOUT WITH (FORMAT csv, DELIMITER ',', HEADER, NULL 'NULL');""", data_file)
            data_file.close()

    if delete_backup_dir: # nothing to back up
        log("Nothing to backup")
        os.rmdir(path_to_backup_dir)

    cursor.close()
    conn.close()
