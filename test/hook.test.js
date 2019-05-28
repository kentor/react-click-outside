global.requestAnimationFrame = callback => setTimeout(callback, 0);

const Adapter = require('enzyme-adapter-react-16');
const { configure } = require('enzyme');

configure({ adapter: new Adapter() });

const enzyme = require('enzyme');
const React = require('react');
const { useClickOutside } = require('../index');

const mountNode = document.createElement('div');
document.body.appendChild(mountNode);

function mount(element) {
  return enzyme.mount(element, { attachTo: mountNode });
}

function simulateClick(node) {
  const event = new window.MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  node.dispatchEvent(event);
  return event;
}

describe('useClickOutside', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = undefined;
  });

  afterEach(() => {
    if (wrapper && wrapper.unmount) {
      wrapper.unmount();
    }
  });

  it('calls handleClickOutside when clicked outside of component', () => {
    const clickInsideSpy = jest.fn();
    const clickOutsideSpy = jest.fn();

    const EnhancedComponent = () => {
      const ref = useClickOutside(clickOutsideSpy);
      return (
        <div ref={ref} id="enhancedNode" onClick={clickInsideSpy}>
          <div id="nestedNode" />
        </div>
      );
    };

    class Root extends React.Component {
      render() {
        return (
          <div>
            <EnhancedComponent />
            <div id="outsideNode" />
          </div>
        );
      }
    }

    wrapper = mount(<Root />);

    const enhancedNode = wrapper.find('#enhancedNode').getDOMNode();
    const nestedNode = wrapper.find('#nestedNode').getDOMNode();
    const outsideNode = wrapper.find('#outsideNode').getDOMNode();

    simulateClick(enhancedNode);
    expect(clickInsideSpy.mock.calls.length).toBe(1);
    expect(clickOutsideSpy.mock.calls.length).toBe(0);

    simulateClick(nestedNode);
    expect(clickInsideSpy.mock.calls.length).toBe(2);
    expect(clickOutsideSpy.mock.calls.length).toBe(0);

    // Stop propagation in the outside node should not prevent the
    // handleOutsideClick handler from being called
    outsideNode.addEventListener('click', e => e.stopPropagation());

    const event = simulateClick(outsideNode);
    expect(clickOutsideSpy).toHaveBeenCalledWith(event);
  });

  it('does not call handleClickOutside when unmounted', () => {
    const clickOutsideSpy = jest.fn();

    const EnhancedComponent = () => {
      const ref = useClickOutside(clickOutsideSpy);
      return <div ref={ref} />;
    };

    class Root extends React.Component {
      constructor() {
        super();
        this.state = {
          showEnhancedComponent: true,
        };
      }

      render() {
        return (
          <div>
            {this.state.showEnhancedComponent && <EnhancedComponent />}
            <div id="outsideNode" />
          </div>
        );
      }
    }

    wrapper = mount(<Root />);
    const outsideNode = wrapper.find('#outsideNode').getDOMNode();

    expect(clickOutsideSpy.mock.calls.length).toBe(0);
    simulateClick(outsideNode);
    expect(clickOutsideSpy.mock.calls.length).toBe(1);

    wrapper.setState({ showEnhancedComponent: false });

    simulateClick(outsideNode);
    expect(clickOutsideSpy.mock.calls.length).toBe(1);
  });
});
