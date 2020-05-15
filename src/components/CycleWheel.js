export default class CycleWheel {
    constructor() {
        this.steps = {};

        // Angles depending of the part
        // of the day
        this.sunsetAngle = 15;
        this.nightAngle = 0;
        this.sunriseAngle = -15;
    }

    /**
     * Set the steps of the instance
     * 
     * @param {Object} steps 
     */
    init(steps) {
        this.steps = steps;
    }

    /**
     * Change the angle rotation depending of
     * the part of the day
     * 
     * @param {float} position 
     */
    rotateWheel(position) {
        console.log(window.screen);
        if(position >= this.steps.sunriseStep) {
            // Change angle
            // depending of the size of the screen
            window.screen.availWidth >= 1024 ? document.documentElement.style.setProperty('--wheel-rotation', (this.sunriseAngle+90) + 'deg') : document.documentElement.style.setProperty('--wheel-rotation', this.sunriseAngle + 'deg');
        }
        else if(position >= this.steps.sunsetStep) {
            // Change angle
            window.screen.availWidth >= 1024 ? document.documentElement.style.setProperty('--wheel-rotation', (this.nightAngle+90) + 'deg') : document.documentElement.style.setProperty('--wheel-rotation', this.nightAngle + 'deg');
            console.log('night');
        }
        else {
            // Change angle
            window.screen.availWidth >= 1024 ? document.documentElement.style.setProperty('--wheel-rotation', (this.sunsetAngle+90) + 'deg') : document.documentElement.style.setProperty('--wheel-rotation', this.sunsetAngle + 'deg');
            console.log('sunset');
        }
    }

    nightRotation() {
        window.screen.availWidth >= 1024 ? document.documentElement.style.setProperty('--wheel-rotation', (this.nightAngle+90) + 'deg') : document.documentElement.style.setProperty('--wheel-rotation', this.nightAngle + 'deg');
    }
    sunsetRotation() {
        window.screen.availWidth >= 1024 ? document.documentElement.style.setProperty('--wheel-rotation', (this.sunsetAngle+90) + 'deg') : document.documentElement.style.setProperty('--wheel-rotation', this.sunsetAngle + 'deg');
    }
    sunriseRotation() {
        window.screen.availWidth >= 1024 ? document.documentElement.style.setProperty('--wheel-rotation', (this.sunriseAngle+90) + 'deg') : document.documentElement.style.setProperty('--wheel-rotation', this.sunriseAngle + 'deg');
    }
}