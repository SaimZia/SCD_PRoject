import React from 'react';
import { TextField } from '@mui/material';

const TextFields = ({ label, inputProps, ...props }) => (
  <div>
    <label style={{ marginBottom: '0.5rem', display: 'block' }}>{label}</label>
    <TextField
      {...props}
      InputProps={{
        ...inputProps,
        sx: { borderWidth: '1px' },
      }}
    />
  </div>
);

export default TextFields;
