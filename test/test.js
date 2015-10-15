const enhanceWithClickOutside = require('../index');
const expect = require('expect');
const React = require('react/addons');

function simulateClick(node) {
  const event = document.createEvent('Event');
  event.initEvent('click', true, true);
  node.dispatchEvent(event);
  return event;
}

describe('enhanceWithClickOutside', () => {
  it('throws an error if component does not provide handleClickOutside', () => {
    expect(() => {
      const Component = React.createClass({
        displayName: 'UncoolComponent',

        render() {
          return null;
        },
      });
      enhanceWithClickOutside(Component);
    }).toThrow('UncoolComponent must implement handleClickOutside().');
  });

  it('calls handleClickOutside when clicked outside of component', () => {
    const clickInsideSpy = expect.createSpy();
    const clickOutsideSpy = expect.createSpy();

    const ToBeEnhancedComponent = React.createClass({
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

    const OutsideComponent = React.createClass({
      render() {
        return <div />;
      },
    });

    const Root = React.createClass({
      render() {
        return (
          <div>
            <EnhancedComponent ref="enhancedComponent"/>
            <OutsideComponent ref="outsideComponent" />
          </div>
        );
      },
    });

    const rootComponent = React.render(<Root />, document.body);

    const enhancedComponent = rootComponent.refs.enhancedComponent;
    const enhancedNode = React.findDOMNode(enhancedComponent);

    const wrappedComponent = enhancedComponent.__wrappedComponent;

    const nestedNode = React.findDOMNode(wrappedComponent.refs.nested);

    const outsideNode = React.findDOMNode(rootComponent.refs.outsideComponent);

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
    React.unmountComponentAtNode(document.body);
    expect(document.removeEventListener).toHaveBeenCalledWith(
      'click', enhancedComponent.handleClickOutside, true
    );
  });

  it('calls handleClickOutside even if wrapped component renders null', () => {
    const clickOutsideSpy = expect.createSpy();

    const WrappedComponent = React.createClass({
      displayName: 'NullComponent',

      handleClickOutside() {
        clickOutsideSpy();
      },

      render() {
        return null;
      },
    });

    const EnhancedComponent = enhanceWithClickOutside(WrappedComponent);

    const RootComponent = React.createClass({
      render() {
        return (
          <div>
            <EnhancedComponent ref="enhancedComponent" />
          </div>
        );
      },
    });

    const rootComponent = React.render(<RootComponent />, document.body);

    // We shouldn't TypeError when we try to call handleClickOutside
    expect(() => {
      rootComponent.refs.enhancedComponent.handleClickOutside();
    }).toNotThrow(TypeError);

    // If the component returns null, technically every click is an outside
    // click, so we should call the inner handleClickOutside always
    expect(clickOutsideSpy.calls.length).toBe(1);
  });
});
