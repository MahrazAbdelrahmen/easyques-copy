// Create a new file, for example, FirstNameInput.js

import React from 'react';

const MyInput = ({ value, onChange, placeholder, labelText, type, id }) => {
    return (
      <div className="grid content-start justify-items-center w-4/5 h-20 mt-0">
        {/* Label */}
        <label className="text-sm text-grey block m-2 float-left w-[70%]" htmlFor={id}>
          {labelText}
        </label>
        
        {/* Input */}
        <input
          className="outline outline-offset-2 outline-blue text-grey rounded-2xl block h-8 text-gray-600 py-1 px-8 w-[80%] mb-2 rounded-0"
          value={value}
          onChange={onChange}
          type={type}
          id={id}
          placeholder={placeholder}
        />
        
        {/* Error message */}
      </div>
    );
  };

export default MyInput;
