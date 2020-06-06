export default class Loader {
    constructor() {}

    init() {
        document.body.classList.add('loader');
    }

    destroy() {
        document.body.classList.add('loader--hidden');
        document.body.addEventListener('transitionend', event => {
            document.body.classList.remove('loader');
            document.body.classList.remove('loader--hidden');
        })
    }
}