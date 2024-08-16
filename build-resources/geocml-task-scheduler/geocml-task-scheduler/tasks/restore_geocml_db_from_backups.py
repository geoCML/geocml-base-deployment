import ast
from io import StringIO
import psycopg2
import os
import subprocess
from time import time
from task_logger import log

def restore_geocml_db_from_backups():
    try:
        conn = psycopg2.connect(dbname="geocml_db",
                                user="postgres",
                                password="admin",
                                host="geocml-postgres",
                                port=5432)
    except psycopg2.OperationalError:
        log("Couldn\'t connect to geocml_db; is the postgresql service started?")
        return

    db_backups_dir = os.path.join(os.sep, "Persistence", "DBBackups")
    now = time()
    delta = float("inf")
    most_recent_backup = ""
    for subdir in os.walk(db_backups_dir):
        try:
            subdir_timestamp = float(subdir[0].split("/")[-1])
            if now - subdir_timestamp < delta:
                delta = now - subdir_timestamp
                most_recent_backup = subdir[0]
        except ValueError:
            if not subdir[0] == db_backups_dir:
                log("Found something unexpected in backup directory, skipping over: {}".format(subdir[0]))

    if most_recent_backup == "":
        log("No recent backups found. Aborting restoration process.")
        return 0

    log("Restoring geocml_db from {}".format(most_recent_backup))

    cursor = conn.cursor()

    # Rebuild tables from .tabor file

    out = subprocess.run(["tabor", "read", "--file", os.path.join(most_recent_backup, "geocml_db.tabor")],
                         capture_output=True)

    if out.stderr:
        log("Failed to read .tabor file {}".format(out.stderr))

    psql_data = ast.literal_eval(out.stdout.decode())

    for table, psql_queries in psql_data.items():
        log("Restoring table: {}".format(table))
        for _, value in psql_queries.items():
            cursor.execute(value)

    conn.commit() # commit schema changes to the database before loading data from the CSV
    log("Tables restored!")

    for csv_data_file in os.listdir(most_recent_backup): # load data from CSV backups
        file_name_split = csv_data_file.split(":")

        if file_name_split[0] == "data":
            log("Found CSV data file {}".format(csv_data_file))
            file_name_split = file_name_split[1].split(".")
            data_file = open(os.path.join(db_backups_dir, most_recent_backup, csv_data_file), "r").readlines()
            cursor.copy_from(StringIO("".join(data_file[1::])), f"{file_name_split[1]}", sep=",",
                             columns=tuple(data_file[0].replace("\n", "").split(",")))
            log("Finished loading data!")

    conn.commit()
    cursor.close()
    conn.close()
    return 0