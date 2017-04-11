const createClass = require('create-react-class');
const hoistNonReactStatic = require('hoist-non-react-statics');
const React = require('react');
const ReactDOM = require('react-dom');

module.exports = function enhanceWithClickOutside(WrappedComponent) {
  const componentName = WrappedComponent.displayName || WrappedComponent.name;

  const EnhancedComponent = createClass({
    displayName: `Wrapped${componentName}`,

    componentDidMount() {
      document.addEventListener('click', this.handleClickOutside, true);
    },

    componentWillUnmount() {
      document.removeEventListener('click', this.handleClickOutside, true);
    },

    handleClickOutside(e) {
      const domNode = ReactDOM.findDOMNode(this);
      const wrappedComponent = this.__wrappedComponent;
      if (
        (!domNode || !domNode.contains(e.target)) &&
        typeof wrappedComponent.handleClickOutside === 'function'
      ) {
        wrappedComponent.handleClickOutside(e);
      }
    },

    render() {
      return (
        <WrappedComponent
          {...this.props}
          ref={c => { this.__wrappedComponent = c; }}
        />
      );
    },
  });

  return hoistNonReactStatic(EnhancedComponent, WrappedComponent);
};
