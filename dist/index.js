'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var ReactDOM = require('react-dom');

module.exports = function enhanceWithClickOutside(WrappedComponent) {
  if (!WrappedComponent.prototype.handleClickOutside) {
    throw new Error(WrappedComponent.displayName + ' must implement handleClickOutside().');
  }

  return React.createClass({
    displayName: 'Wrapped' + WrappedComponent.displayName,

    componentDidMount: function componentDidMount() {
      this.__wrappedComponent = this.refs.wrappedComponent;
      document.addEventListener('click', this.handleClickOutside, true);
    },

    componentWillUnmount: function componentWillUnmount() {
      document.removeEventListener('click', this.handleClickOutside, true);
    },

    handleClickOutside: function handleClickOutside(e) {
      var domNode = ReactDOM.findDOMNode(this);
      if (!domNode || !domNode.contains(e.target)) {
        this.refs.wrappedComponent.handleClickOutside(e);
      }
    },

    render: function render() {
      return React.createElement(WrappedComponent, _extends({}, this.props, { ref: 'wrappedComponent' }));
    }
  });
};