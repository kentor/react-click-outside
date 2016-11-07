'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var hoistNonReactStatic = require('hoist-non-react-statics');
var React = require('react');
var ReactDOM = require('react-dom');

module.exports = function enhanceWithClickOutside(WrappedComponent) {
  var componentName = WrappedComponent.displayName || WrappedComponent.name;

  var EnhancedComponent = React.createClass({
    displayName: 'Wrapped' + componentName,

    componentDidMount: function componentDidMount() {
      this.__wrappedComponent = this.refs.wrappedComponent;
      document.addEventListener('click', this.handleClickOutside, true);
    },
    componentWillUnmount: function componentWillUnmount() {
      document.removeEventListener('click', this.handleClickOutside, true);
    },
    handleClickOutside: function handleClickOutside(e) {
      var domNode = ReactDOM.findDOMNode(this);
      var handleClickOutside = this.refs.wrappedComponent.props.handleClickOutside || this.refs.wrappedComponent.handleClickOutside;

      if ((!domNode || !domNode.contains(e.target)) && typeof handleClickOutside === 'function') {
        handleClickOutside(e);
      }
    },
    render: function render() {
      return React.createElement(WrappedComponent, _extends({}, this.props, { ref: 'wrappedComponent' }));
    }
  });

  return hoistNonReactStatic(EnhancedComponent, WrappedComponent);
};