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
      document.addEventListener('click', this.handleClickOutside, true);
    },
    componentWillUnmount: function componentWillUnmount() {
      document.removeEventListener('click', this.handleClickOutside, true);
    },
    handleClickOutside: function handleClickOutside(e) {
      var domNode = ReactDOM.findDOMNode(this);
      var wrappedComponent = this.__wrappedComponent;
      if ((!domNode || !domNode.contains(e.target)) && typeof wrappedComponent.handleClickOutside === 'function') {
        wrappedComponent.handleClickOutside(e);
      }
    },
    render: function render() {
      var _this = this;

      return React.createElement(WrappedComponent, _extends({}, this.props, {
        ref: function ref(c) {
          _this.__wrappedComponent = c;
        }
      }));
    }
  });

  return hoistNonReactStatic(EnhancedComponent, WrappedComponent);
};