import yaml
import os

def get_status(service: str) -> bool:
    status_file_path = os.path.join(os.sep, "Persistence", "geocml-status.yml")
    try:
        status_file = open(status_file_path, "r")
        status_file_data = yaml.safe_load(status_file)
        return status_file_data[service][1]
    except FileNotFoundError:
        return False

def get_postgres_connection_details_as_yaml() -> str:
    return """
    host: geocml-postgres
    port: 5432
    database: geocml_db
    """
