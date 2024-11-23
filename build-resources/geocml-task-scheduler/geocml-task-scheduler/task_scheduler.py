from task_logger import log
from time import sleep

class TaskScheduler(object):
    def __init__(self):
        self.schedule = {}

    def add(self, task, timeout):
        """
        task: Task
        timeout: int
        """
        try:
            self.schedule[str(task)] = {
                "task": task,
                "timeout": timeout,
                "last_ran": 0,
                "ret_code": -1
            }
        except KeyError:
            log('FATAL: {} is already scheduled'.format(str(task)))

    def tick(self):
        while True:
            sleep(0.25)
            updated_schedule = self.schedule.copy()
            for key, value in self.schedule.items():
                if value["last_ran"] >= value["timeout"]:
                    if value["ret_code"] == 0:
                        del updated_schedule[key]
                        continue

                    value["last_ran"] = 0
                    value["ret_code"] = value["task"].start()
                value["last_ran"] += 0.25
            self.schedule = updated_schedule
