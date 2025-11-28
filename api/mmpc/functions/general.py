import datetime
import string
import random

def check_date(year, month, day):
    correctDate = None
    try:
        newDate = datetime.datetime(int(year), int(month), int(day))
        correctDate = True
    except ValueError:
        correctDate = False
    return correctDate


def id_generator(size=10, chars=string.ascii_uppercase + string.digits):
      return ''.join(random.choice(chars) for _ in range(size))