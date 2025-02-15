import subprocess
from enum import Enum

class ServiceController(object):
    def restart_service(self, service):
        return subprocess.run(["docker", "restart", f"{self.get_container_id(service)}"])

    def get_container_id(self, service):
        return subprocess.run(["docker", "ps", "-aqf", f"name={service}"], capture_output=True, text=True).stdout.split("\n")[0]

    def run_command_sh(self, service, cmd):
        # BE VERY CAREFUL WITH THIS METHOD! BAD THINGS COULD HAPPEN IF YOU ARE NOT.
        return subprocess.run(f'docker exec {self.get_container_id(service)} sh -c "{cmd}"', capture_output=True, text=True, shell=True)
