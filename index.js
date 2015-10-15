const React = require('react');

module.exports = function enhanceWithClickOutside(WrappedComponent) {
  if (!WrappedComponent.prototype.handleClickOutside) {
    throw new Error(
      `${WrappedComponent.displayName} must implement handleClickOutside().`
    );
  }

  return React.createClass({
    displayName: `Wrapped${WrappedComponent.displayName}`,

    componentDidMount() {
      this.__wrappedComponent = this.refs.wrappedComponent;
      document.addEventListener('click', this.handleClickOutside, true);
    },

    componentWillUnmount() {
      document.removeEventListener('click', this.handleClickOutside, true);
    },

    handleClickOutside(e) {
      const domNode = React.findDOMNode(this);
      if (!domNode || !domNode.contains(e.target)) {
        this.refs.wrappedComponent.handleClickOutside(e);
      }
    },

    render() {
      return <WrappedComponent {...this.props} ref="wrappedComponent" />;
    },
  });
};
