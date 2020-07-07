'use strict';
var PID = function (Input, Setpoint, Kp, Ki, Kd, ControllerDirection) {
    this.input = Input;
    this.mySetpoint = Setpoint;
    this.inAuto = false;
    this.setOutputLimits(0, 255);
    this.SampleTime = 100;
    this.setTunings(Kp, Ki, Kd);
    this.setControllerDirection(ControllerDirection);
    this.lastTime = this.millis() - this.SampleTime;
    this.myBias = 0;
    this.ITerm = 0;
    this.myOutput = 0;
};
PID.prototype.setInput = function (current_value) {
    this.input = Number(current_value);
};
PID.prototype.setPoint = function (current_value) {
    this.mySetpoint = Number(current_value);
};
PID.prototype.setBias = function (current_value) {
    if (current_value > this.outMax) {
        current_value = this.outMax;
    }
    else if (current_value < this.outMin) {
        current_value = this.outMin;
    }
    this.myBias = Number(current_value);
};
PID.prototype.millis = function () {
    var d = new Date();
    return d.getTime();
};
PID.prototype.compute = function () {
    if (!this.inAuto) {
        return false;
    }
    var now = this.millis();
    var timeChange = now - this.lastTime;
    if (timeChange >= this.SampleTime) {
        var input = this.input;
        var error = input - this.mySetpoint;
        error = error * this.setDirection;
        this.ITerm += this.ki * error;
        if (this.ITerm > this.outMax - this.myBias) {
            this.ITerm = this.outMax - this.myBias;
        }
        else if (this.ITerm < this.outMin - this.myBias) {
            this.ITerm = this.outMin - this.myBias;
        }
        var dInput = input - this.lastInput;
        var output = this.kp * error + this.ITerm - this.kd * dInput + this.myBias;
        if (output > this.outMax) {
            output = this.outMax;
        }
        else if (output < this.outMin) {
            output = this.outMin;
        }
        this.myOutput = output;
        this.lastInput = input;
        this.lastTime = now;
        return true;
    }
    else {
        return false;
    }
};
PID.prototype.setTunings = function (Kp, Ki, Kd) {
    if (Kp < 0 || Ki < 0 || Kd < 0) {
        return;
    }
    this.dispKp = Kp;
    this.dispKi = Ki;
    this.dispKd = Kd;
    this.SampleTimeInSec = this.SampleTime / 1000;
    this.kp = Kp;
    this.ki = Ki * this.SampleTimeInSec;
    this.kd = Kd / this.SampleTimeInSec;
};
PID.prototype.setSampleTime = function (NewSampleTime) {
    if (NewSampleTime > 0) {
        var ratio = NewSampleTime / (1.0 * this.SampleTime);
        this.ki *= ratio;
        this.kd /= ratio;
        this.SampleTime = Math.round(NewSampleTime);
    }
};
PID.prototype.setOutput = function (val) {
    if (val > this.outMax) {
        val = this.outMax;
    }
    else if (val < this.outMin) {
        val = this.outMin;
    }
    this.myOutput = val;
};
PID.prototype.setOutputLimits = function (Min, Max) {
    if (Min >= Max) {
        return;
    }
    this.outMin = Min;
    this.outMax = Max;
    if (this.inAuto) {
        if (this.myOutput > this.outMax) {
            this.myOutput = this.outMax;
        }
        else if (this.myOutput < this.outMin) {
            this.myOutput = this.outMin;
        }
        if (this.ITerm > this.outMax - this.myBias) {
            this.ITerm = this.outMax - this.myBias;
        }
        else if (this.ITerm < this.outMin - this.myBias) {
            this.ITerm = this.outMin - this.myBias;
        }
    }
};
PID.prototype.setMode = function (Mode) {
    var newAuto;
    if (Mode == 0 ||
        Mode.toString().toLowerCase() == 'automatic' ||
        Mode.toString().toLowerCase() == 'auto') {
        newAuto = 1;
    }
    else if (Mode == 1 || Mode.toString().toLowerCase() == 'manual') {
        newAuto = 0;
    }
    else {
        throw new Error('Incorrect Mode Chosen');
    }
    this.inAuto = newAuto;
};
PID.prototype.initialize = function () {
    this.ITerm = 0;
    this.myOutput = this.myBias;
    this.lastInput = this.input;
};
PID.prototype.setControllerDirection = function (ControllerDirection) {
    if (ControllerDirection == 0 || ControllerDirection.toString().toLowerCase() == 'direct') {
        this.setDirection = 1;
    }
    else if (ControllerDirection == 1 ||
        ControllerDirection.toString().toLowerCase() == 'reverse') {
        this.setDirection = -1;
    }
    else {
        throw new Error('Incorrect Controller Direction Chosen');
    }
};
PID.prototype.getKp = function () {
    return this.dispKp;
};
PID.prototype.getKd = function () {
    return this.dispKd;
};
PID.prototype.getKi = function () {
    return this.dispKi;
};
PID.prototype.getMode = function () {
    return this.inAuto ? 'Auto' : 'Manual';
};
PID.prototype.getDirection = function () {
    return this.controllerDirection;
};
PID.prototype.getOutput = function () {
    return this.myOutput;
};
PID.prototype.getInput = function () {
    return this.input;
};
PID.prototype.getSetPoint = function () {
    return this.mySetpoint;
};
PID.prototype.getBias = function () {
    return this.myBias;
};
module.exports = PID;
//# sourceMappingURL=pid-controller.js.map