import os
import subprocess

def healthcheck_services():
    services = {
        "geocml-desktop": [10000, True],
        "geocml-server": [80, True],
        "geocml-postgres": [5432, True],
    }

    path_to_status_file = os.path.join(os.sep, "Persistence", "geocml-status")

    for service in services:
        out = subprocess.run(["nmap", "-p", str(services[service][0]), service], capture_output=True)

        if out.stderr:
            services[service][1] = False

    status_file = open(path_to_status_file, "w")
    status_file.writelines(str(services))  # TODO: export as YAML
