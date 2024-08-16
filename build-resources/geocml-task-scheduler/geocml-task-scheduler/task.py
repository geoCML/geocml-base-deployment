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
        self.args = args # TODO: do args work?
        self.timeout = timeout

    def run(self):
        """
        Calls the target function every n seconds
        """
        while True:
            sleep(self.timeout)
            start = time()
            log('Running \'{}\' at {}'.format(self.target.__name__, start), self.target)

            try:
                ret_code = self.target()
                log('Ran \'{}\' in {}'.format(self.target.__name__, time() - start), self.target)
                if ret_code == 0: # ret_code 0: task stopped successfully
                    log('Stopping task \'{}\' at {} with exit code 0'.format(self.target.__name__, time()),
                       self.target)
                    return
            # TODO: ret_code 1: task stopped due to expected error
            # TODO: other ret_codes: log warning (ret_code {} is not valid)
            except Exception as e:
                log('FATAL: {} at {}'.format(e, time())) # TODO: should the task be stopped after this?
