from task import Task
from task_scheduler import TaskScheduler
from backup_geocml_db import backup_geocml_db
from restore_geocml_db_from_backups import restore_geocml_db_from_backups
from healthcheck_services import healthcheck_services
from register_with_drgon import register_with_drgon

scheduler = TaskScheduler()

# DEFINE TASKS HERE
backup_geocml_db_task = Task(backup_geocml_db, ())
restore_geocml_db_task = Task(restore_geocml_db_from_backups, ())
healthcheck_services_task = Task(healthcheck_services, ())
register_with_drgon_task = Task(register_with_drgon, ())

# ADD TASKS TO SCHEDULER HERE
scheduler.add(backup_geocml_db_task, 3600)  # task runs every hour
scheduler.add(restore_geocml_db_task, 1)  # task runs every second until stopped
scheduler.add(healthcheck_services_task, 60)
scheduler.add(register_with_drgon_task, 60)


scheduler.tick()
