# mqtt-nodemotion

Detect motion from a PIR sensor and publish it to an MQTT broker. All in Node.js and running on an **Onion Omega**.

## PIR settings for HC-SR501
- Trigger Mode Selection Jumper: Repeatable Trigger (inner pins)
- Time delay (left screw with sensor pointing upwards): Fully counter-clockwise (3 sec)
- Sensitivity (right screw with sensor pointing upwards) depends on use case: Fully clockwise for 3 meters, fully counter-clockwise for 7 meters
