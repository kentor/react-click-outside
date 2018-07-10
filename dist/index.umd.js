(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('react-dom')) :
  typeof define === 'function' && define.amd ? define(['react', 'react-dom'], factory) :
  (global.ReactClickOutside = factory(global.React,global.ReactDOM));
}(this, (function (react,reactDom) { 'use strict';

  react = react && react.hasOwnProperty('default') ? react['default'] : react;
  reactDom = reactDom && reactDom.hasOwnProperty('default') ? reactDom['default'] : reactDom;

  /**
   * Copyright 2015, Yahoo! Inc.
   * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
   */

  var REACT_STATICS = {
      childContextTypes: true,
      contextTypes: true,
      defaultProps: true,
      displayName: true,
      getDefaultProps: true,
      mixins: true,
      propTypes: true,
      type: true
  };

  var KNOWN_STATICS = {
      name: true,
      length: true,
      prototype: true,
      caller: true,
      callee: true,
      arguments: true,
      arity: true
  };

  var defineProperty = Object.defineProperty;
  var getOwnPropertyNames = Object.getOwnPropertyNames;
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var getPrototypeOf = Object.getPrototypeOf;
  var objectPrototype = getPrototypeOf && getPrototypeOf(Object);

  var hoistNonReactStatics = function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
      if (typeof sourceComponent !== 'string') {
          // don't hoist over string (html) components

          if (objectPrototype) {
              var inheritedComponent = getPrototypeOf(sourceComponent);
              if (inheritedComponent && inheritedComponent !== objectPrototype) {
                  hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
              }
          }

          var keys = getOwnPropertyNames(sourceComponent);

          if (getOwnPropertySymbols) {
              keys = keys.concat(getOwnPropertySymbols(sourceComponent));
          }

          for (var i = 0; i < keys.length; ++i) {
              var key = keys[i];
              if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
                  var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
                  try {
                      // Avoid failures from read-only properties
                      defineProperty(targetComponent, key, descriptor);
                  } catch (e) {}
              }
          }

          return targetComponent;
      }

      return targetComponent;
  };

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





  function enhanceWithClickOutside(Component) {
    var componentName = Component.displayName || Component.name;

    var EnhancedComponent = function (_React$Component) {
      _inherits(EnhancedComponent, _React$Component);

      function EnhancedComponent(props) {
        _classCallCheck(this, EnhancedComponent);

        var _this = _possibleConstructorReturn(this, (EnhancedComponent.__proto__ || Object.getPrototypeOf(EnhancedComponent)).call(this, props));

        _this.handleClickOutside = _this.handleClickOutside.bind(_this);
        return _this;
      }

      _createClass(EnhancedComponent, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          document.addEventListener('click', this.handleClickOutside, true);
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          document.removeEventListener('click', this.handleClickOutside, true);
        }
      }, {
        key: 'handleClickOutside',
        value: function handleClickOutside(e) {
          var domNode = this.__domNode;
          if ((!domNode || !domNode.contains(e.target)) && this.__wrappedInstance && typeof this.__wrappedInstance.handleClickOutside === 'function') {
            this.__wrappedInstance.handleClickOutside(e);
          }
        }
      }, {
        key: 'render',
        value: function render() {
          var _this2 = this;

          var _props = this.props,
              wrappedRef = _props.wrappedRef,
              rest = _objectWithoutProperties(_props, ['wrappedRef']);

          return react.createElement(Component, _extends({}, rest, {
            ref: function ref(c) {
              _this2.__wrappedInstance = c;
              _this2.__domNode = reactDom.findDOMNode(c);
              wrappedRef && wrappedRef(c);
            }
          }));
        }
      }]);

      return EnhancedComponent;
    }(react.Component);

    EnhancedComponent.displayName = 'clickOutside(' + componentName + ')';

    return hoistNonReactStatics(EnhancedComponent, Component);
  }

  var reactClickOutside = enhanceWithClickOutside;

  return reactClickOutside;

})));