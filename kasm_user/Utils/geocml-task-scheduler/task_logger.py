task_log_path = '/home/kasm-user/Logs/task_log'

def log(message, task=None):
    """
    task: function
    message: str
    """
    f = open(task_log_path, 'a')
    if task == None:
        f.write('{}\n'.format(message))
    else:
        f.write('{}:{}\n'.format(task.__name__, message))
    f.close()
