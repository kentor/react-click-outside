// @flow

const hoistNonReactStatic = require('hoist-non-react-statics');
const React = require('react');
const ReactDOM = require('react-dom');

function enhanceWithClickOutside(Component: React.ComponentType<*>) {
  const componentName =
    Component.displayName || Component.name || 'WrappedComponent';

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
      const wrappedInstance: any = this.__wrappedInstance;
      if (
        (!domNode || !domNode.contains(e.target)) &&
        wrappedInstance &&
        typeof wrappedInstance.handleClickOutside === 'function'
      ) {
        wrappedInstance.handleClickOutside(e);
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

function useClickOutside(onClickOutside: (e: Event) => void) {
  const [domNode, setDomNode] = React.useState(null);

  React.useEffect(
    () => {
      const onClick = (e: Event) => {
        if ((!domNode || !domNode.contains(e.target)) && onClickOutside)
          onClickOutside(e);
      };

      document.addEventListener('click', onClick, true);
      return () => {
        document.removeEventListener('click', onClick, true);
      };
    },
    [domNode, onClickOutside]
  );

  const refCallback = React.useCallback(setDomNode, [onClickOutside]);

  return refCallback;
}

enhanceWithClickOutside.useClickOutside = useClickOutside;

module.exports = enhanceWithClickOutside;
