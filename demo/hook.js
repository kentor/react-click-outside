const React = require('react');
const ReactDOM = require('react-dom');
const { useClickOutside } = require('../index');

const style = {
  backgroundColor: '#fff',
  border: '1px solid #000',
  height: 100,
  width: 100,
};

const Target = () => {
  const handleClickOutside = React.useCallback(() => {
    const hue = Math.floor(Math.random() * 360);
    document.body.style.backgroundColor = `hsl(${hue}, 100%, 87.5%)`;
  }, []);
  const clickOutsideRef = useClickOutside(handleClickOutside);
  const isMobile = 'ontouchstart' in document.body;
  return <div ref={clickOutsideRef} style={style}>{`mobile: ${isMobile}`}</div>;
};

const Root = () => (
  <div>
    <Target />
    <button style={style}>Button Element</button>
  </div>
);

if ('ontouchstart' in document.documentElement) {
  document.body.style.cursor = 'pointer';
  document.documentElement.style.touchAction = 'manipulation';
}

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<Root />, root);
