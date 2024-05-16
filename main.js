class ExpandableComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
        }

        summary {
          cursor: pointer;
          padding: 10px;
          border: 1px solid #ccc;
          background: #f9f9f9;
        }

        details > summary {
          list-style: none;
        }
        details > summary::-webkit-details-marker {
          display: none;
        }

        summary[aria-hidden="true"] {
          height: 32px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        details {
          display: block;
        }

        details[open] summary {
          display: none;
        }

        .content {
          padding: 10px;
          border: 1px solid #ccc;
        }

        #toggle {
          display: block;
          margin-top: 10px;
          padding: 5px 10px;
          cursor: pointer;
        }
      </style>
      <details>
        <summary aria-hidden="true"><slot name="clone"></slot></summary>
        <div class="content">
          <slot></slot>
        </div>
      </details>
      <button id="toggle">Toggle</button>
    `;
  }

  connectedCallback() {
    this.cloneContentToLightDOM();

    this.shadowRoot.querySelector('#toggle').addEventListener('click', () => {
      const details = this.shadowRoot.querySelector('details');
      details.open = !details.open;
    });
  }

  cloneContentToLightDOM() {
    const slot = document.createElement('div');
    slot.setAttribute('slot', 'clone');

    // Clone and move the content from the original slot to the new slot
    const nodes = Array.from(this.childNodes);
    nodes.forEach(node => {
      const clone = node.cloneNode(true);
      slot.appendChild(clone);
    });

    // Append the new slot to the LightDOM to preserve styles from LightDOM
    this.appendChild(slot);
  }
}

customElements.define('expandable-component', ExpandableComponent);
