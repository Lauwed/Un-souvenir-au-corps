export default class SkyBackground {
    /**
     * @param {CycleWheel} cycleWheel 
     */
    constructor(cycleWheel) {
        // Latitude and longitude of Brussels by default
        this.lat = '50.8466';
        this.lng = '4.3528';

        // From this API : https://sunrise-sunset.org/api
        // formatted=0 to transform the data into Date objects
        this.apiURL = 'https://api.sunrise-sunset.org/json?lat=' + this.lat + '&lng=' + this.lng + '&formatted=0';

        // The HTML object on which the background will change
        this.containerHTML = document.querySelector('.js-background');

        // The measure of 1/24 of the height of the site
        this.onePartHeight = (document.body.clientHeight) / 24;

        // Hours when the sun rises and sets
        // Data from Brussels by default
        this.sunsetHours = 19;
        this.sunriseHours = 4;
        // Values of when the sun rises and sets
        // in function of the height of the body
        // Data from Brussels by default
        this.sunsetStep = this.sunsetHours * this.onePartHeight;
        this.sunriseStep = this.sunriseHours * this.onePartHeight;

        // The CycleWheel object
        this.cycleWheel = cycleWheel;
    }

    init() {
        // Set the latitude and longitude
        this.setLatLng();
        // Add an event listener on the window resize
        this.setResizeEventListener();
        
        /* FETCH */
        const that = this;
        fetch(this.apiURL)
            .then(function(response) {
                return response.json();
            }).then(function(json) {
                console.log(json);
                const sunrise = json.results.sunrise;
                // The website ends by the sunrise so the
                // hours will be reverse
                that.sunriseHours = 24 - that.getHours(new Date(sunrise));
                const sunset = json.results.sunset;
                // The website begins by the sunset so the
                // hours will be reverse
                that.sunsetHours = 24 - that.getHours(new Date(sunset));
            
                that.sunriseStep = that.sunriseHours * that.onePartHeight;
                that.sunsetStep = that.sunsetHours * that.onePartHeight;

                // Init the cycleWheel
                that.cycleWheel.init({
                    sunsetStep: that.sunsetStep,
                    sunriseStep: that.sunriseStep
                });

                // Init the position
                that.setNightOrDay(window.pageYOffset + (window.innerHeight/2));
                that.cycleWheel.rotateWheel(window.pageYOffset + (window.innerHeight/2));
            
                console.log(that.sunriseHours, that.sunriseStep, that.sunsetHours, that.sunsetStep);
            
                that.setScrollEventListener();
            })
            // If the Fetch fails
            .catch(function(error) {
                // Display the error in the console
                console.error('Il y a eu un problème lors de l\'excecution du Fetch : ' + error);

                // Init the cycleWheel
                that.cycleWheel.init({
                    sunsetStep: that.sunsetStep,
                    sunriseStep: that.sunriseStep
                });

                // Init the position
                that.setNightOrDay(window.pageYOffset + (window.innerHeight/2));
                that.cycleWheel.rotateWheel(window.pageYOffset + (window.innerHeight/2));

                // Set the scrolling event listener but
                // with the default datas set in the 
                // constructor
                that.setScrollEventListener();
            });
    }

    /**
     * Ask the user if we can get access to
     * his/her geolocalisation
     * Set the latitude and longitude
     */
    setLatLng() {
        const that = this;
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                that.lat = position.coords.latitude;
                that.lng = position.coords.longitude;
            });
        }
    }

    /**
     * Update the background and text color
     * depending if this is night, sunrise or sunset
     * 
     * @param {float} position 
     */
    setNightOrDay(position) {
        if(position >= this.sunriseStep) {
            console.log('day');
            this.containerHTML.classList.add('js-sunrise');

            // Change color text
            document.documentElement.style.setProperty('--color-text', '#2B2B2B');
            // Change rotation wheel
            this.cycleWheel.sunriseRotation();

            // Delete the night class
            this.containerHTML.classList.remove('js-night');
        }
        else if(position >= this.sunsetStep) {
            console.log('night');
            this.containerHTML.classList.add('js-night');

            // Change color text
            document.documentElement.style.setProperty('--color-text', '#F7F7F7');
            // Change rotation wheel
            this.cycleWheel.nightRotation();

            // Delete the sunset and sunrise class
            this.containerHTML.classList.remove('js-sunset');
            this.containerHTML.classList.remove('js-sunrise');
        }
        else {
            console.log('day');
            this.containerHTML.classList.add('js-sunset');

            // Change color text
            document.documentElement.style.setProperty('--color-text', '#2B2B2B');
            // Change rotation wheel
            this.cycleWheel.sunsetRotation();

            // Delete the night class
            this.containerHTML.classList.remove('js-night');
        }
    }

    /**
     * Add event listener to adjust the data depending 
     * of the new height
     */
    setResizeEventListener() {
        const that = this;
        window.addEventListener('resize', (e) => {
            // Use setInterval to prevent
            // lag of the resize event listener
            setTimeout(that.resizeFunction(), 250);
        });
    }

    /**
     * Add event listener on the scroll to change
     * the background color depending of the position
     */
    setScrollEventListener() {
        // Add event when the scrolling meet every
        // 1/24 of the screen. 24 hours in a day
        window.addEventListener('scroll', (e) => {
            // Changing the position of the cursor from the 
            // top left corner to the middle left.
            this.setNightOrDay(window.pageYOffset + (window.innerHeight/2));
        })
    }

    /**
     * Update values when the height changes by resizing
     */
    resizeFunction() {
        this.onePartHeight = (document.body.clientHeight) / 24;
        this.sunriseStep = this.sunriseHours * this.onePartHeight;
        this.sunsetStep = this.sunsetHours * this.onePartHeight;
    }

    /**
     * Get the hour by arrounding if the minutes are
     * higher than 40
     * 
     * @param {Date} date 
     */
    getHours(date) {
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        if(minutes >= 40) {
            return hours + 1;
        }
        return hours;
    }
}