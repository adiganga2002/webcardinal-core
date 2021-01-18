import { Component, h } from '@stencil/core';
import { HostElement } from '../../decorators';

@Component({
  tag: 'wcc-app-container',
  styleUrls: {
    default: '../../styles/wcc-app-container/wcc-app-container.scss'
  }
})
export class WccAppContainer {
  @HostElement() host: HTMLElement;

  private slots = {
    before: false,
    after: false,
    unnamed: false,
  }

  async componentWillLoad() {
    // manage slots
    this.slots.unnamed = this.host.children.length > 0;
    for (const key of Object.keys(this.slots)) {
      if (this.host.querySelector(`[slot=${key}]`)) {
        this.slots[key] = true;
        this.host.classList.add(`slot-${key}`);
      } else {
        this.host.classList.remove(`slot-${key}`);
      }
    }
  }

  render() {
    return [
      ( this.slots.before
        ? <div class="container before">
            <slot name="before"/>
          </div>
        : null
      ),
      <div class="container app-container">
        { this.slots.unnamed ? <slot/> : <wcc-app-router/> }
      </div>,
      ( this.slots.after
        ? <div class="container after">
            <slot name="after"/>
          </div>
        : null
      )
    ];
  }
}
