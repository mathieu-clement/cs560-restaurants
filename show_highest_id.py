#!/usr/bin/env python3

import json
import sys

with open(sys.argv[1], 'r', encoding='utf8') as f:
    json = json.load(f) 

    highest_id = -1
    for str_id, data in json.items():
        int_id = int(str_id)
        if int_id > highest_id:
            highest_id = int_id

    print("Highest ID:", highest_id)
