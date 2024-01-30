import React from 'react';
import { render } from 'react-dom';
import PopupApplication from './popup/index';

import "./Style/popup.scss";

const trackException = (exception: any) => {
  console.log('Error on send exception to GA!', exception);
};

const onContentLoaded = () => {
  let ComponentElement = document.getElementById('popup-application');
  if (!ComponentElement) {
    return;
  }

  try {
    render(<PopupApplication/>, ComponentElement);
  } catch (exception) {
    ComponentElement.innerHTML = 'Something wrong!';
    console.error(
      "\n Error in React component:\n ------------------------------ \n",
      exception
    );

    trackException(exception);
  }
};

document.addEventListener('DOMContentLoaded', onContentLoaded);
