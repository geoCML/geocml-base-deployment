import yaml
import os
import logging
from django.http import HttpResponse
from django.template import loader
from portal.settings import GEOCML_VERSION

logger = logging.getLogger(__name__)

def get_status(service):
    try:
        res = os.system('ping {} -c 2'.format(service))
        if res == 0:
            return True
        else:
            return False
    except RuntimeError as e:
        logger.warning(e)
        return False

def get_vnc_connection_details_as_yaml(request):
    return """
    url: {}:5901
    """.format(request.get_host())

def get_postgres_connection_details_as_yaml():
    return """
    host: geocml-postgres
    port: 5432
    database: geocml_db
    """

def index(request):
    portal_config_yaml = yaml.safe_load(open(os.path.join('Persistence', 'portal-config.yaml')).read())
    template = loader.get_template('index.html')
    context = {
        'version': GEOCML_VERSION,
        'hostname': request.get_host().split(':')[0],
        'name': portal_config_yaml['name'],
        'description': portal_config_yaml['description'],
        'copyright': portal_config_yaml['copyright'],
        'geocml_desktop_status': get_status('geocml-desktop'),
        'geocml_postgres_status': get_status('geocml-postgres'),
        'geocml_server_status': get_status('geocml-server'),
        'geocml_task_scheduler_status': get_status('geocml-task-scheduler'),
        'vnc_connection_details': get_vnc_connection_details_as_yaml(request),
        'postgres_connection_details': get_postgres_connection_details_as_yaml()
    }
    return HttpResponse(template.render(context, request))

def webmap(request):
    template = loader.get_template('webmap.html')
    return HttpResponse(template.render(None, request))