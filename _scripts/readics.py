#!/usr/bin/env python
from __future__ import print_function
from ics import Calendar
import io
import sys
import yaml

def log(*x):
    sys.stderr.write(' '.join(map(str, x)) + '\n')
    sys.stderr.flush()

def processCalendar(cal):
    ret = []
    for event in cal.events:
        print(repr(event))
    return ret

for filename in sys.argv[1:]:
    log('reading', filename)
    with io.open(filename, 'r') as fh:
        c = Calendar(fh.read())
        log(repr(c))
        print(yaml.safe_dump(processCalendar(c)))
