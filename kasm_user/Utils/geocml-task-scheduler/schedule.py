from task import Task
from backup_geocml_db import backup_geocml_db
from restore_geocml_db_from_backups import restore_geocml_db_from_backups

backup_geocml_db_task = Task(backup_geocml_db, (), 3600) # task runs every hour
backup_geocml_db_task.start()

restore_geocml_db_task = Task(restore_geocml_db_from_backups, (), 1) # task runs every second until stopped
restore_geocml_db_task.start()
