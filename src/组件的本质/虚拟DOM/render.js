import { h } from 'snabbdom';

const MyComponent = (props) => {
  return h('h1', props.title);
};

export { MyComponent };