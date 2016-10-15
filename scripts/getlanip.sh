#!/bin/bash

/sbin/ifconfig | /usr/bin/awk '/wlan0/{getline; print}' | /usr/bin/cut -d\":\" -f2 | /usr/bin/cut -d\" \" -f1