from agent.driver.Car import car
from components.Log import log
from agent.driver.Steer import steer
import time

def car_move(direction, velocity, unit):
    log.info('car_move')
    car.setVelocity(int(velocity),int(direction)*90,0)

def car_turn(direction, angular_rate):
    log.info('car_turn')
    if direction == '0':
        car.setVelocity(0,0,-int(angular_rate))
    else:
        car.setVelocity(0,0,int(angular_rate))


def arm_turn(direction, angle):
    log.info('arm_turn')
    angle = int(angle)
    if direction=='3':
        steer.setPWMServoAngle(6,90-angle)
    elif direction=='2':
        steer.setPWMServoAngle(6,90+angle)
    elif direction=='0':
        steer.setPWMServoAngle(5,90+angle)
        steer.setPWMServoAngle(3,90+angle)
    else:
        steer.setPWMServoAngle(5,90-angle)
        steer.setPWMServoAngle(3,90-angle)

def claw_turn(direction, angle):
    log.info('claw_turn')
    angle = int(angle)
  
    angle=angle+90
    if angle<90:
        angle =90
    steer.setPWMServoAngle(1,angle)

def sleep(second):
    time.sleep(int(second))

def stop_all_motors():
    log.info('stop_all_motors')
    car.setVelocity(0,0,0)