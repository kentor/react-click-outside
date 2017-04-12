const createReactClass = require('create-react-class');
const enhanceWithClickOutside = require('../index');
const expect = require('expect');
const React = require('react');
const ReactDOM = require('react-dom');

function simulateClick(node) {
  const event = document.createEvent('Event');
  event.initEvent('click', true, true);
  node.dispatchEvent(event);
  return event;
}

const mountNode = document.createElement('div');
document.body.appendChild(mountNode);

describe('enhanceWithClickOutside', () => {
  afterEach(() => {
    ReactDOM.unmountComponentAtNode(mountNode);
  });

  it('calls handleClickOutside when clicked outside of component', () => {
    const clickInsideSpy = expect.createSpy();
    const clickOutsideSpy = expect.createSpy();

    class ToBeEnhancedComponent extends React.Component {
      handleClick() {
        clickInsideSpy();
      }

      handleClickOutside(e) {
        this.testBoundToComponent(e);
      }

      testBoundToComponent(e) {
        clickOutsideSpy(e);
      }

      render() {
        return (
          <div onClick={this.handleClick}>
            <div ref="nested" />
          </div>
        );
      }
    }

    const EnhancedComponent = enhanceWithClickOutside(ToBeEnhancedComponent);

    class Root extends React.Component {
      render() {
        return (
          <div>
            <EnhancedComponent ref="enhancedComponent"/>
            <div ref="outsideComponent" />
          </div>
        );
      }
    }

    const rootComponent = ReactDOM.render(<Root />, mountNode);

    const enhancedComponent = rootComponent.refs.enhancedComponent;
    const enhancedNode = ReactDOM.findDOMNode(enhancedComponent);

    const wrappedComponent = enhancedComponent.__wrappedComponent;

    const nestedNode = ReactDOM.findDOMNode(wrappedComponent.refs.nested);

    const outsideNode = rootComponent.refs.outsideComponent;

    simulateClick(enhancedNode);
    expect(clickInsideSpy.calls.length).toBe(1);
    expect(clickOutsideSpy.calls.length).toBe(0);

    simulateClick(nestedNode);
    expect(clickInsideSpy.calls.length).toBe(2);
    expect(clickOutsideSpy.calls.length).toBe(0);

    // Stop propagation in the outside node should not prevent the
    // handleOutsideClick handler from being called
    outsideNode.addEventListener('click', e => e.stopPropagation());

    const event = simulateClick(outsideNode);
    expect(clickOutsideSpy).toHaveBeenCalledWith(event);
  });

  it('calls handleClickOutside even if wrapped component renders null', () => {
    const clickOutsideSpy = expect.createSpy();
    class WrappedComponent extends React.Component {
      handleClickOutside() {
        clickOutsideSpy();
      }

      render() {
        return null;
      }
    }
    const EnhancedComponent = enhanceWithClickOutside(WrappedComponent);
    const enhancedComponent = ReactDOM.render(<EnhancedComponent />, mountNode);

    // We shouldn't TypeError when we try to call handleClickOutside
    expect(() => {
      enhancedComponent.handleClickOutside();
    }).toNotThrow(TypeError);

    // If the component returns null, technically every click is an outside
    // click, so we should call the inner handleClickOutside always
    expect(clickOutsideSpy.calls.length).toBe(1);
  });

  it('does not call handleClickOutside when unmounted', (done) => {
    const clickOutsideSpy = expect.createSpy();

    class ToBeEnhancedComponent extends React.Component {
      handleClickOutside() {
        clickOutsideSpy();
      }

      render() {
        return <div />;
      }
    }

    const EnhancedComponent = enhanceWithClickOutside(ToBeEnhancedComponent);

    class Root extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          showEnhancedComponent: true,
        };
      }

      render() {
        return (
          <div>
            {this.state.showEnhancedComponent &&
              <EnhancedComponent ref="enhancedComponent"/>
            }
            <div ref="outsideComponent" />
          </div>
        );
      }
    }

    const rootComponent = ReactDOM.render(<Root />, mountNode);
    const outsideNode = rootComponent.refs.outsideComponent;

    expect(clickOutsideSpy.calls.length).toBe(0);
    simulateClick(outsideNode);
    expect(clickOutsideSpy.calls.length).toBe(1);

    rootComponent.setState({ showEnhancedComponent: false }, () => {
      simulateClick(outsideNode);
      expect(clickOutsideSpy.calls.length).toBe(1);
      done();
    });
  });

  it('does nothing if handleClickOutside is not implemented', () => {
    class WrappedComponent extends React.Component {
      render() {
        return <div />;
      }
    }
    const EnhancedComponent = enhanceWithClickOutside(WrappedComponent);
    const enhancedComponent = ReactDOM.render(<EnhancedComponent />, mountNode);
    enhancedComponent.handleClickOutside({});
  });

  describe('displayName', () => {
    it('gets set for React.createClass', () => {
      const ReactClass = createReactClass({
        displayName: 'ReactClass',
        handleClickOutside() {},
        render() {},
      });
      const Wrapped = enhanceWithClickOutside(ReactClass);
      expect(Wrapped.displayName).toBe('WrappedReactClass');
    });

    it('gets set for ES6 classes', () => {
      class ES6Class extends React.Component {
        handleClickOutside() {}
        render() {}
      }
      const Wrapped = enhanceWithClickOutside(ES6Class);
      expect(Wrapped.displayName).toBe('WrappedES6Class');
    });
  });
});
