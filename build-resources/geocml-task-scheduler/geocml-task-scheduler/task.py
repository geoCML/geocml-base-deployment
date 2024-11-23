from threading import Thread
from time import time
from task_logger import log

class Task(object):
    def __init__(self, target, args):
        """
        target: function
        args: tuple
        """
        Thread.__init__(self)
        self.target = target
        self.args = args

    def __str__(self):
        return self.target.__name__

    def start(self):
        start = time()
        log("Running \'{}\' at {}".format(str(self), str(self), start), self.target)
        ret_code = 1

        try:
            ret_code = self.target(*self.args)
            log("Ran \'{}\' in {}".format(str(self), str(self), time() - start), self.target)
            if ret_code == 0: # ret_code 0: task stopped successfully, 1: task failed, will try again
                log("Stopping task \'{}\' at {} with exit code 0".format(str(self), str(self), time()),
                    self.target)
        except Exception as e:
            log("FATAL: {} at {}".format(str(self), e, time()))

        return ret_code
