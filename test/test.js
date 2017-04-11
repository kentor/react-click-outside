const createClass = require('create-react-class');
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

    const ToBeEnhancedComponent = createClass({
      handleClick() {
        clickInsideSpy();
      },

      handleClickOutside(e) {
        this.testBoundToComponent(e);
      },

      testBoundToComponent(e) {
        clickOutsideSpy(e);
      },

      render() {
        return (
          <div onClick={this.handleClick}>
            <div ref="nested" />
          </div>
        );
      },
    });

    const EnhancedComponent = enhanceWithClickOutside(ToBeEnhancedComponent);

    const Root = createClass({
      render() {
        return (
          <div>
            <EnhancedComponent ref="enhancedComponent"/>
            <div ref="outsideComponent" />
          </div>
        );
      },
    });

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

    expect.spyOn(document, 'removeEventListener').andCallThrough();
    ReactDOM.unmountComponentAtNode(mountNode);
    expect(document.removeEventListener).toHaveBeenCalledWith(
      'click', enhancedComponent.handleClickOutside, true
    );
  });

  it('calls handleClickOutside even if wrapped component renders null', () => {
    const clickOutsideSpy = expect.createSpy();
    const WrappedComponent = createClass({
      handleClickOutside() {
        clickOutsideSpy();
      },
      render() {
        return null;
      },
    });
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

  it('does nothing if handleClickOutside is not implemented', () => {
    const WrappedComponent = createClass({
      render() {
        return <div />;
      },
    });
    const EnhancedComponent = enhanceWithClickOutside(WrappedComponent);
    const enhancedComponent = ReactDOM.render(<EnhancedComponent />, mountNode);
    enhancedComponent.handleClickOutside({});
  });

  describe('displayName', () => {
    it('gets set for React.createClass', () => {
      const ReactClass = createClass({
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
