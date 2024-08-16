import yaml
import os
import logging
from django.http import HttpResponse, HttpRequest
from django.template import loader
from portal.settings import GEOCML_VERSION
from portal.utils import get_status, get_postgres_connection_details_as_yaml

logger = logging.getLogger(__name__)

def index(request: HttpRequest) -> HttpResponse:
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
        'geocml_task_scheduler_status': True,
        'postgres_connection_details': get_postgres_connection_details_as_yaml()
    }
    return HttpResponse(template.render(context, request))


def webmap(request: HttpRequest) -> HttpResponse:
    template = loader.get_template('webmap.html')
    return HttpResponse(template.render(None, request))
