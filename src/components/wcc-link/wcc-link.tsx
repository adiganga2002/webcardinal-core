import { Component, Event, EventEmitter, h, Prop } from '@stencil/core';
import { HostElement } from '../../decorators';
import { promisifyEventEmit } from '../../utils';

@Component({
  tag: 'wcc-link',
  shadow: true
})
export class WccLink {

  @HostElement() host: HTMLElement;

  @Prop({ mutable: true }) href: string | null;

  @Prop() tag: string | null;

  @Event({
    eventName: 'webcardinal:tags:get',
    bubbles: true, composed: true, cancelable: true
  }) getTagsEvent: EventEmitter;

  private content;

  async componentWillLoad() {
    if (!this.host.isConnected) {
      return;
    }

    // navigate by tag
    if (!this.href) {
      try {
        this.href = await promisifyEventEmit(this.getTagsEvent, { tag: this.tag });
        this.content = (
          <stencil-route-link url={this.href}>
            <slot />
          </stencil-route-link>
        )
        return;
      } catch (error) {
        console.error(error);
        return;
      }
    }

    try {
      let hrefURL;
      if (this.href.startsWith('/')) {
        hrefURL = new URL(this.href, window.location.href);
      } else {
        hrefURL = new URL(this.href)
      }

      if (window.location.origin === hrefURL.origin) {
        this.href = hrefURL.pathname;
        this.content = (
          <stencil-route-link url={this.href}>
            <slot />
          </stencil-route-link>
        )
      } else {
        this.content = (
          <a href={this.href}>
            <slot />
          </a>
        )
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return this.content;
  }
}
