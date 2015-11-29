# React Click Outside [![Build Status](https://travis-ci.org/kentor/react-click-outside.svg)](https://travis-ci.org/kentor/react-click-outside) [![npm](https://img.shields.io/npm/v/react-click-outside.svg)](https://www.npmjs.com/package/react-click-outside)

Enhance a React component with a Higher Order Component that provides click
outside detection.

**Note:** React 0.14 required for version >= 2.x. This assumes `react` and
`react-dom` is installed in your project. Continue using version 1.x for React
0.13 support.

## Usage
Installation:

```
npm install react-click-outside
```

Some component that you wish to enhance with click outside detection:

```js
const enhanceWithClickOutside = require('react-click-outside');
const React = require('react');

const Dropdown = React.createClass({
  getInitialState() {
    return {
      isOpened: false,
    };
  },

  handleClickOutside() {
    this.setState({ isOpened: false });
  },

  render() {
    ...
  },
});

module.exports = enhanceWithClickOutside(Dropdown);
```

**Note:** There will be no error thrown if `handleClickOutside` is not
implemented.

## Details

The `enhanceWithClickOutside` function wraps the provided component in another
component that registers a click handler on `document` for the event capturing
phase. Using the event capturing phase prevents elements with a click handler
that calls `stopPropagation` from cancelling the click event that would
eventually trigger the component's `handleClickOutside` function.

## Why not a mixin?

There are some mixins that provide click outside detection functionality, but
they prevent the component from implementing the  `componentDidMount` and
`componentWillUnmount` life cycle hooks. I recommend not using a mixin for this
case.

## Limitations

- IE9+ due to the usage of the event capturing phase.

## License

[MIT](LICENSE.txt)
