import { Component, Element, h, Host, Prop, State } from '@stencil/core';

const LOADER_TYPES = [
  'default',
  'iframe'
]

@Component({
  tag: 'c-app-loader',
  shadow: true
})
export class CAppLoader {
  private defaults = {
    type: LOADER_TYPES[0],
  };

  @Element() host: HTMLElement;

  @Prop() src: string = null;

  @Prop({ mutable: true }) type: string = this.defaults.type;

  @State() content: string = null;
  private error: boolean = false;

  private async _getContent() {
    try {
      const response = await fetch(this.src);
      this.error = false;
      return await response.text();
    } catch (error) {
      this.error = true;
      throw error;
    }
  }

  async componentWillLoad() {
    this.type = this.type.toLowerCase();
    if (!LOADER_TYPES.includes(this.type)) {
      this.type = this.defaults.type;
    }
  }

  async componentWillRender() {
    this._getContent()
      .then(data => this.content = data)
      .catch(error => console.error(error))
  }

  render() {
    if (this.error) {
      return <h4>{`Page ${this.src} could not be loaded!`}</h4>
    }

    switch (this.type) {
      case 'iframe': {
        const attributes = {
          frameBorder: 0,
          style: {
            overflow: 'hidden',
            width: '100%', height: '100%'
          },
          src: 'data:text/html;charset=utf-8, ' + escape(this.content)
        };
        return <iframe {...attributes}/>;
      }
      default: {
        const attributes = {
          style: {
            display: 'block',
            width: '100%', height: '100%'
          }
        }
        this.host.innerHTML = this.content;
        return (
          <Host {...attributes}>
            <slot/>
          </Host>
        )
      }
    }
  }
}
