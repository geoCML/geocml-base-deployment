from task import Task

def say_hi():
    print('hiii')

def say_bye():
    print('byeee')

def say_why():
    print('whyyy')

t1 = Task(say_hi, (), 10)
t1.start()

t2 = Task(say_bye, (), 1)
t2.start()

t3 = Task(say_why, (), 5)
t3.start()

