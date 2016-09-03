# mqtt-nodemotion

Detect motion from a PIR sensor and publish it to an MQTT broker. All in Node.js and running on an **Onion Omega**.

## PIR settings for HC-SR501
- Trigger Mode Selection Jumper: Repeatable Trigger (inner pins)
- Time delay (left screw with sensor pointing upwards): Fully counter-clockwise (3 sec)
- Sensitivity (right screw with sensor pointing upwards) depends on use case: Fully clockwise for 3 meters, fully counter-clockwise for 7 meters


## Startup script
1. Copy `mqtt-nodemotion.init_file` to `/etc/init.d/mqtt-nodemotion`
1. Change `PROJECT_DIR` (and other settings) if needed
1. Do `chmod +x mqtt-nodemotion` to make it executable
1. Do `/etc/init.d/mqtt-nodemotion enable` to enable autostart on boot
1. Do `/etc/init.d/mqtt-nodemotion start` to start it for the first time
1. Check `/var/log/mqtt-nodemotion.log` for any errors. When everything's good, the last line should read "Running...".