import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Buttons(props) {
  const { color, label, onClick, x, size } = props;

  return (
    <button type="button" class={`btn btn-${color} btn-${size}`} onClick={onClick} style={{ marginLeft: x }} >
      {label}
    </button>
  );
}

export default Buttons;
