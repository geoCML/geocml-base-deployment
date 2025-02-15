from task_logger import log
from service_controller import ServiceController

controller = ServiceController()
def refresh_font_cache():
    out = controller.run_command_sh("geocml-desktop", "find /Persistence/Fonts/ -name '*.ttf' -exec cp {} ~/.fonts \; &")
    if out.stderr:
        log(f"Failed to collect fonts from /Persistence/Fonts/: {out.stderr}")
        return 0

    out = controller.run_command_sh("geocml-desktop", "fc-cache -f -v &")
    if out.stderr:
        log(f"Failed to update font cache: {out.stderr}")
        return 0
