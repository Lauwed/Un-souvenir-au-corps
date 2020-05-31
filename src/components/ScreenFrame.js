/*
 * TODO :
 * - On resize
 * - animation svg
 * - améliorer longueur visibilité animation
 * - Revoir apparition des SVG
*/

export default class ScreenFrame {
    /**
     * Sets the different variables of the class
     * 
     * @param {Element} HTMLNodeStart The HTML Element where the screen frame must be fixed
     * @param {Element} [HTMLNodeEnd = null] The HTML Element where the screen frame must be unfixed
     */
    constructor(HTMLNodeStart, HTMLNodeEnd = null) {
        this.posY = window.scrollY;
        this.frame;
        this.activeSection = 0;
        this.oldSection = 0;

        this.black = "#2B2B2B";
        this.blackAlpha = "#2B2B2B85";
        this.white = "#F7F7F7";

        // Get all the images and sections of the scroll animation
        this.contentElements = document.querySelectorAll('.frame-content');
        this.contentSections = document.querySelectorAll('.frame-section');

        // Get total heights of all the content images
        let elementsTotalHeight = 0;
        this.contentElements.forEach(element => {
            elementsTotalHeight += element.clientHeight;
            console.log(element.clientHeight);
        });

        this.startY = HTMLNodeStart.offsetTop;
        // If the parameter HTMLNodeEnd is set
        if(HTMLNodeEnd) {
            this.endY = HTMLNodeEnd.offsetHeight;
        }
        else {
            // If not, use the bottom position of the element HTMLNodeStart
            this.endY = HTMLNodeStart.offsetTop + HTMLNodeStart.offsetHeight - elementsTotalHeight;
        }
    }

    /**
     * Hide all the images
     * Create the node with the frame of the screen
     * Sets the event listener on the scroll
     */
    init() {
        // Add the class to hide images
        this.contentElements.forEach(element => {
            element.classList.add('frame-content--hidden');
        });

        this.frame = this.createHTMLNodeFrame();
        // Update this.endY
        this.endY -= this.frame.offsetHeight;
        this.frame.style.top = this.startY + 'px'; // Set the position at the beginning of the HTML element

        console.log(this.startY, this.endY);

        window.addEventListener('scroll', function() {
            this.setPosY(window.scrollY);
            
            if(this.posY >= this.startY && this.posY <= this.endY) {
                // Tell the frame to be fixed position
                console.log(window.scrollY, this.startY, this.endY);
                this.frame.classList.add('frame--fixed');
                // Add class on the body for custom CSS
                document.body.classList.add('frame-active');
                // Change background color
                document.documentElement.style.setProperty('--frame-bg', this.blackAlpha);
                // Change color text
                document.documentElement.style.setProperty('--color-text', this.white);

                // To know which section the scroll is on
                this.contentSections.forEach((section, index) => {
                    if(this.posY >= section.offsetTop && this.posY <= section.offsetTop + section.offsetHeight) {
                        this.activeSection = index;
                    }
                });
                if(this.activeSection < this.contentElements.length) {
                    // If move on an onther section
                    if(this.oldSection !== this.activeSection) {
                        // hide the old content
                        this.contentElements[this.oldSection].classList.remove('frame-content--active');
                        // The old section becomes the new one
                        this.oldSection = this.activeSection;
                    }
                    // Show the content
                    this.contentElements[this.activeSection].classList.add('frame-content--active');
                }
            }
            else {
                console.log('coucou');
                if(this.posY > this.endY) {
                    // Set the frame position at the end of the HTML Element
                    this.frame.style.top = this.endY + 'px';
                }
                else {
                    // Set the frame position at the beginning of the HTML Element
                    this.frame.style.top = this.startY + 'px';
                }
                // Remove the class on the body
                document.body.classList.remove('frame-active');
                // hide the old content
                this.contentElements[this.oldSection].classList.remove('frame-content--active');
                // Set the top CSS property of the frame
                this.frame.classList.remove('frame--fixed');
                // Change background color
                document.documentElement.style.setProperty('--frame-bg', 'transparent');
                // Change color text
                document.documentElement.style.setProperty('--color-text', this.black);
            }
        }.bind(this));
    }

    /**
     * Setter of the variable this.posY
     * @param {int} val Value that will be stocked in the variable this.posY
     */
    setPosY(val) {
        this.posY = val;
    }

    /**
     * Create the HTML Elements of the Frame and add them to the main
     * 
     * @returns {Element} The SVG element that contains the screen frame
     */
    createHTMLNodeFrame() {
        // The div container
        const container = document.createElement('div');
        container.classList.add('frame');

        // The div background
        const bg = document.createElement('div');
        bg.classList.add('frame__bg');
        container.appendChild(bg);

        // Add the SVG
        const svg = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 393 680" class="svg-responsive frame__svg">
        <g fill="none" fill-rule="evenodd" transform="translate(0 1)"><path fill="#2B2B2B" d="M353 0c22.09139 0 40 17.90861 40 40v598c0 22.09139-17.90861 40-40 40H40c-22.09139 0-40-17.90861-40-40V40C0 17.90861 17.90861 0 40 0h313zm-13 18H54c-22.09139 0-40 17.90861-40 40v550c0 22.09139 17.90861 40 40 40h286c22.09139 0 40-17.90861 40-40V58c0-22.09139-17.90861-40-40-40z"/><path fill="#F7F7F7" fill-opacity=".25" d="M14 608c0 22.09139 17.90861 40 40 40h286c22.09139 0 40-17.90861 40-40v12c0 22.09139-17.90861 40-40 40H54c-22.09139 0-40-17.90861-40-40z"/><rect width="366" height="630" x="14" y="18" stroke="#000" stroke-width="3" rx="40"/></g>
    </svg>`;
        container.innerHTML += svg;

        // Append the container to the main
        document.querySelector('main').appendChild(container);

        return container;
    }
}