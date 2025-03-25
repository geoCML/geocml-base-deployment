import psycopg2
import os
import subprocess
from time import time
from task_logger import log
import glob
import re


def restore_geocml_db_from_backups():
    try:
        conn = psycopg2.connect(
            dbname="geocml_db",
            user="postgres",
            password=os.environ["GEOCML_POSTGRES_ADMIN_PASSWORD"],
            host="geocml-postgres",
            port=5432,
        )
    except psycopg2.OperationalError:
        log("Couldn't connect to geocml_db; is the postgresql service started?")
        return

    db_backups_dir = os.path.join(os.sep, "Persistence", "DBBackups")
    now = time()
    delta = float("inf")
    most_recent_backup = ""
    for subdir in os.walk(db_backups_dir):
        try:
            if "rasters" in subdir[0]:
                continue

            subdir_timestamp = float(subdir[0].split("/")[-1])
            if now - subdir_timestamp < delta:
                delta = now - subdir_timestamp
                most_recent_backup = subdir[0]
        except ValueError:
            if not subdir[0] == db_backups_dir:
                log(
                    "Found something unexpected in backup directory, skipping over: {}".format(
                        subdir[0]
                    )
                )

    if most_recent_backup == "":
        log("No recent backups found. Aborting restoration process.")
        return 0

    log("Restoring geocml_db from {}".format(most_recent_backup))

    # Rebuild tables from .tabor file

    out = subprocess.run(
        [
            "tabor",
            "load",
            "--file",
            os.path.join(most_recent_backup, "geocml_db.tabor"),
            "--db",
            "geocml_db",
            "--host",
            "geocml-postgres",
            "--username",
            "postgres",
            "--password",
            os.environ["GEOCML_POSTGRES_ADMIN_PASSWORD"],
        ],
        capture_output=True,
    )
    if out.stderr:
        log("Failed to load tables from .tabor file")
        return 0

    cursor = conn.cursor()
    cursor.execute("SET session_replication_role = replica;")

    for csv_data_file in os.listdir(most_recent_backup):  # load data from CSV backups
        file_name_split = csv_data_file.split(":")

        if file_name_split[0] == "data":
            log("Found CSV data file {}".format(csv_data_file))
            file_name_split = file_name_split[1].split(".csv")
            [schema, table] = [
                file_name_split[0].split(".")[0],
                file_name_split[0].split(".")[1],
            ]
            csv_file_path = os.path.join(
                db_backups_dir, most_recent_backup, csv_data_file
            )

            # Read header separately to get column names
            with open(csv_file_path, "r") as f:
                header = f.readline().strip()
                columns = tuple(header.replace("\n", "").split(","))

            # Stream the data from the file
            with open(csv_file_path, "r") as f:
                # Skip the header line
                next(f)
                log(f"Loading data to: {schema}.{table}")
                cursor.execute(f"SET search_path TO {schema}")
                cursor.copy_from(f, table, sep=",", columns=columns, null="NULL")

            log("Finished loading data!")

    # load raster data
    raster_files = glob.glob(os.path.join(most_recent_backup, "rasters", "*.png"))
    if not raster_files:
        log("No raster files found to restore")
    else:
        # Process each raster file
        for raster_file in raster_files:
            table_name = re.split("_\\d+", raster_file.split("/")[-1])[0]
            cursor.execute(
                f"""CREATE TABLE IF NOT EXISTS "{table_name}" (
                    rast raster,
                    filename TEXT
                );"""
            )
            conn.commit()

            raster2pgsql_cmd = [
                "raster2pgsql",
                "-I",  # Create spatial index
                raster_file,
                "-F",
                "-a",
                table_name,
            ]
            raster2pgsql_process = subprocess.Popen(
                raster2pgsql_cmd, stdout=subprocess.PIPE
            )
            raster2pgsql_output = raster2pgsql_process.communicate()[0].decode()

            if raster2pgsql_process.returncode != 0:
                log(f"Failed to restore raster file: {raster_file}")
                return

            log(f"raster2pgsql_output: {raster2pgsql_output}")
            cursor.execute(raster2pgsql_output)

    conn.commit()

    cursor.execute("SET session_replication_role = DEFAULT;")

    cursor.close()
    conn.close()
    return 0
