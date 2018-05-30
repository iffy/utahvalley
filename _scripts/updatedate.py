#!/usr/bin/env python
import subprocess
import os
import io
from datetime import date, timedelta

def main(debug=False):
    run = subprocess.check_output if debug else subprocess.check_call
    datefile = os.path.join(os.path.dirname(__file__), '../_data/startdate.yml')

    # git fetch and fast forward
    run(['git', 'fetch', 'origin'])
    run(['git', 'merge', 'origin/master'])

    start = date.today()
    SUNDAY = 6
    while start.weekday() != SUNDAY:
        start += timedelta(days=1)
    with io.open(datefile, 'w') as fh:
        fh.write(u'{0}'.format(start) + u'\n')

    # commit
    run(['git', 'add', datefile])
    try:
        run(['git', 'commit', '-m', 'List from {0}'.format(start)])
    except subprocess.CalledProcessError:
        # nothing to commit
        return
    run(['git', 'push', 'origin', 'master'])

main()