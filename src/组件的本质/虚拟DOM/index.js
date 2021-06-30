import render from './render';

class MyComponent {
  render() {
    return {
      tag: 'div',
    };
  }
}

const component = {
  tag: MyComponent,
};

const h1 = {
  tag: 'h1',
};

render(component, document.querySelector('#app'));
render(h1, document.querySelector('#app'));