import hoistNonReactStatic from 'hoist-non-react-statics';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

function isPrototypeOf(actual, expected) {
  let expectedIsAPrototypeOfActual = actual === expected;
  // Walk prototype chain
  let ip = actual;
  while(ip && ip.prototype && !expectedIsAPrototypeOfActual) {
    expectedIsAPrototypeOfActual = ip === expected;
    ip = ip.prototype;;
  }
  return expectedIsAPrototypeOfActual;
}

module.exports = function factory(unknown) {

  const {
    event = 'click',
  } = unknown || {};

  function decorator(WrappedComponent) {
    const componentName = WrappedComponent.displayName || WrappedComponent.name;

    class EnhancedComponent extends React.Component {
      constructor(props) {
        super(props);
        this.handleClickOutside = this.handleClickOutside.bind(this);
      }

      componentDidMount() {
        document.addEventListener(event, this.handleClickOutside, true);
      }

      componentWillUnmount() {
        document.removeEventListener(event, this.handleClickOutside, true);
      }

      handleClickOutside(e) {
        const domNode = this.__domNode;
        if (
          (!domNode || !domNode.contains(e.target)) &&
          typeof this.__wrappedComponent.handleClickOutside === 'function'
        ) {
          this.__wrappedComponent.handleClickOutside(e);
        }
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            ref={c => {
              this.__wrappedComponent = c;
              this.__domNode = ReactDOM.findDOMNode(c);
            }}
          />
        );
      }
    }

    EnhancedComponent.displayName = `Wrapped${componentName}`;

    return hoistNonReactStatic(EnhancedComponent, WrappedComponent);
  }

  if (isPrototypeOf(unknown, Component) || typeof unknown === 'function') {
    // Is a react class or a function which is potentially a react render function
    const Component = unknown;
    return decorator(Component);
  }
  return decorator;
}
