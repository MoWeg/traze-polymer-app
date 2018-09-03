import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

/**
 * `LowerCaseDashedName` Description
 *
 * @customElement
 * @polymer
 * @demo
 * 
 */
class PolymerTrazeGameTileElement extends PolymerElement {
    static get properties() {
        return {
            tile:{}
        }
    }

    static get template() {
        return html`
            <style>
                .tile-outer {
                    width: 100%;
                    height: 100%;
                    border: 0.5px solid black; 
                }
            </style>
            <div class="tile-outer">
                <div class="tile-inner"></div>
            </div>
        `;
    }

    /**
     * Instance of the element is created/upgraded. Use: initializing state,
     * set up event listeners, create shadow dom.
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Use for one-time configuration of your component after local
     * DOM is initialized.
     */
    ready() {
        super.ready();
    }
}

customElements.define('polymer-traze-game-tile', PolymerTrazeGameTileElement);