const enhanceWithClickOutside = require('../index');
const React = require('react');
const ReactDOM = require('react-dom');

const style = {
  backgroundColor: '#fff',
  border: '1px solid #000',
  height: 100,
  width: 100,
};

const Target = (() => {
  class Target extends React.Component {
    handleClickOutside() {
      const hue = Math.floor(Math.random() * 360);
      document.body.style.backgroundColor = `hsl(${hue}, 100%, 87.5%)`;
    }

    render() {
      const isMobile = 'ontouchstart' in document.body;
      return <div style={style}>{`mobile: ${isMobile}`}</div>;
    }
  }

  return enhanceWithClickOutside(Target);
})();

const WrappedTarget = (() => {
  class WrappedTarget extends React.Component {
    render() {
      return <div style={style}>{this.props.children}</div>;
    }
  }

  return enhanceWithClickOutside(WrappedTarget);
})();

class TargetWithPassedProps extends React.Component {
  constructor() {
    super();
    this.state = { text: 'waiting for click outside' };
  }

  handleClickOutside() {
    this.setState({ text: new Date().toString() });
  }

  render() {
    return (
      <WrappedTarget handleClickOutside={this.handleClickOutside.bind(this)}>
        {this.state.text}
      </WrappedTarget>
    );
  }
}

const Root = () => (
  <div>
    <Target />
    <TargetWithPassedProps />
    <button style={style}>Button Element</button>
  </div>
);

if ('ontouchstart' in document.documentElement) {
  document.body.style.cursor = 'pointer';
  document.documentElement.style.touchAction = 'manipulation';
}

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<Root />, root);
