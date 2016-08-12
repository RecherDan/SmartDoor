#!/bin/bash
echo 254 > /sys/class/gpio/export
sleep 1
echo 222 > /sys/class/gpio/export
sleep 1
echo 214 > /sys/class/gpio/export
sleep 1
echo low > /sys/class/gpio/gpio214/direction
sleep 1
echo high > /sys/class/gpio/gpio254/direction
sleep 1

echo in > /sys/class/gpio/gpio222/direction
sleep 1
echo high > /sys/class/gpio/gpio214/direction
sleep 1
echo 182 > /sys/class/gpio/export
sleep 1
echo 182 > /sys/class/gpio/export
sleep 1
echo 0 > /sys/class/gpio/gpio254/value
sleep 1
node /home/root/smartdoor/server.js
