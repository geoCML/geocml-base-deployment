def log(task=None, message):
    """
    task: function
    message: str
    """
    f = open('/home/kasm-user/Logs/task_log', 'a')
    if task == None:
        f.write('{}:{}\n'.format(message))
    else:
        f.write('{}:{}\n'.format(task.__name__, message))
    f.close()
