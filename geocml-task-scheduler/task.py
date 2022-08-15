from threading import Thread
from time import sleep, time
from task_logger import log

class Task(Thread):
    def __init__(self, target, args, timeout):
        """
        target: function
        args: tuple
        timeout: int
        """
        Thread.__init__(self)
        self.target = target
        self.args = args
        self.timeout = timeout

    def run(self):
        """
        Calls the target function every n seconds
        """
        while True:
            sleep(self.timeout)
            start = time()
            self.target()
            log(self.target.__name__,
                'Ran \'{}\' in {}'.format(self.target.__name__,
                                          time() - start))
