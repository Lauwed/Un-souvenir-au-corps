import ScreenFrame from './components/ScreenFrame';
import Loader from './components/Loader';

// Loader
const loader = new Loader();
loader.init();

// Waiting for the page to load
window.addEventListener('load', function() {
    
    // Launch the frame script !
    const screenFrame = new ScreenFrame();
    screenFrame.init();

    // Remove loader when the loading of the page is complete
    window.setTimeout(() => {
        loader.destroy();
    }, 100);
});