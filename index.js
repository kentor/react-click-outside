// @flow

const hoistNonReactStatic = require('hoist-non-react-statics');
const React = require('react');
const ReactDOM = require('react-dom');

function enhanceWithClickOutside(Component: React.ComponentType<*>) {
  const componentName = Component.displayName || Component.name;

  class EnhancedComponent extends React.Component<*> {
    __domNode: *;
    __wrappedInstance: ?React.Component<*>;
    handleClickOutside: (e: Event) => void;

    constructor(props) {
      super(props);
      this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
      document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
      document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside(e) {
      const domNode = this.__domNode;
      if (
        (!domNode ||
          (domNode.contains
            ? !domNode.contains(e.target)
            : !domNode.base.contains(e.target))) &&
        this.__wrappedInstance &&
        typeof this.__wrappedInstance.handleClickOutside === 'function'
      ) {
        this.__wrappedInstance.handleClickOutside(e);
      }
    }

    render() {
      const { wrappedRef, ...rest } = this.props;

      return (
        <Component
          {...rest}
          ref={c => {
            this.__wrappedInstance = c;
            this.__domNode = ReactDOM.findDOMNode(c);
            wrappedRef && wrappedRef(c);
          }}
        />
      );
    }
  }

  EnhancedComponent.displayName = `clickOutside(${componentName})`;

  return hoistNonReactStatic(EnhancedComponent, Component);
}

module.exports = enhanceWithClickOutside;
