import inspect

task_log_path = 'task_log'

def log(message, task=None):
    """
    task: function
    message: str
    """
    current_frame = inspect.currentframe()
    f = open(task_log_path, "a")
    f.write("[{}]: {}\n".format(inspect.getouterframes(current_frame, 2)[1][3], message))
    f.close()
