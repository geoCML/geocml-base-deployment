from task import Task
from back_up_geocml_db import back_up_geocml_db

back_up_geocml_db_task = Task(back_up_geocml_db, (), 3600) # task runs every hour
back_up_geocml_db_task.start()

