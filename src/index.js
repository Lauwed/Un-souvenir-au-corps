import ScreenFrame from './components/ScreenFrame';

window.addEventListener('load', function(event) {
    const HTMLNodeExperience = document.querySelector('.experience');
    const screenFrame = new ScreenFrame(HTMLNodeExperience);
    screenFrame.init();
})