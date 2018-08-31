import {PolymerElement, html} from '@polymer/polymer';

export default class TrazePolymerApp extends PolymerElement {
    static get template(){
        return html `<p>hello</p>`;
    }
}
window.customElements.define('traze-polymer-app',TrazePolymerApp);