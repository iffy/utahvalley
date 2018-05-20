import subprocess
import os
import io
from datetime import date, timedelta

def main():
    datefile = os.path.join(os.path.dirname(__file__), '../_data/startdate.yml')

    # git fetch and fast forward
    subprocess.check_call(['git', 'fetch', 'origin'])
    subprocess.check_call(['git', 'merge', 'origin/master'])

    start = date.today()
    while start.weekday() != 0:
        start -= timedelta(days=1)
    with io.open(datefile, 'w') as fh:
        fh.write(u'"{0}"'.format(start) + u'\n')

    # commit
    subprocess.check_call(['git', 'add', datefile])
    try:
        subprocess.check_call(['git', 'commit', '-m', 'List from {0}'.format(start)])
    except subprocess.CalledProcessError:
        # nothing to commit
        return
    subprocess.check_call(['git', 'push', 'origin', 'master'])

main()