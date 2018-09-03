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
                .tile{
                    width: 100%;
                    height: 100%;
                    display: block;
                }
            </style>
            <div class="tile" style="background-color:{{tile.color}};"></div>
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