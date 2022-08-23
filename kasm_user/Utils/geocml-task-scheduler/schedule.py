from task import Task
from back_up_geocml_db import back_up_geocml_db
from restore_geocml_db_from_backups import restore_geocml_db_from_backups

back_up_geocml_db_task = Task(back_up_geocml_db, (), 3600) # task runs every hour
back_up_geocml_db_task.start()

restore_geocml_db_task = Task(restore_geocml_db_from_backups, (), 1) # task runs every second until stopped
restore_geocml_db_task.start()
