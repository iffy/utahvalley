import csv
import io
import sys
from datetime import datetime

last_event = ''
with io.open(sys.argv[1], encoding='utf8') as fh:
    reader = csv.DictReader(fh)
    while True:
        try:
            row = next(reader)
        except UnicodeEncodeError as e:
            continue
        except StopIteration:
            break
        if row['Location'] != 'Orem, Utah':
            continue
        date = datetime.strptime(row['Start Date'], '%m/%d/%Y').date()
        if date < datetime.today().date():
            continue
        if last_event == row['Event']:
            print '    - {date}'.format(date=date.strftime('%Y-%m-%d'))
        else:
            print '''
- name: UVU {name}
  url: http://gouvu.com/
  location: Orem
  price: '?'
  tags:
    - sport
    - sitting
  when:
    - {date}'''.format(
        name=row['Event'],
        date=date.strftime('%Y-%m-%d'),
    )
        last_event = row['Event']