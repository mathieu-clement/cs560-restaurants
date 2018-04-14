#!/usr/bin/env python3

import json
import sys

with open(sys.argv[1], 'r', encoding='utf8') as f1:
    json1 = json.load(f1) 

    with open(sys.argv[2], 'r', encoding='utf8') as f2:
        json2 = json.load(f2) 

        for id,data in json2.items():
            json1[id] = data

        with open(sys.argv[3], 'w', encoding='utf8') as outfile:
            json.dump(json1, outfile, separators=(',', ':')) 
