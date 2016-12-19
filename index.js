const hoistNonReactStatic = require('hoist-non-react-statics');
const React = require('react');
const ReactDOM = require('react-dom');

module.exports = function enhanceWithClickOutside(WrappedComponent) {
  const componentName = WrappedComponent.displayName || WrappedComponent.name;

  const EnhancedComponent = React.createClass({
    displayName: `Wrapped${componentName}`,

    componentDidMount() {
      this.__wrappedComponent = this.refs.wrappedComponent;
      document.addEventListener('click touchstart', this.handleClickOutside, true);
    },

    componentWillUnmount() {
      document.removeEventListener('click touchstart', this.handleClickOutside, true);
    },

    handleClickOutside(e) {
      const domNode = ReactDOM.findDOMNode(this);
      if (
        (!domNode || !domNode.contains(e.target)) &&
        typeof this.refs.wrappedComponent.handleClickOutside === 'function'
      ) {
        this.refs.wrappedComponent.handleClickOutside(e);
      }
    },

    render() {
      return <WrappedComponent {...this.props} ref="wrappedComponent" />;
    },
  });

  return hoistNonReactStatic(EnhancedComponent, WrappedComponent);
};
