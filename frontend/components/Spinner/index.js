import React from 'react';
import PropTypes from 'prop-types';
import { PulseSpinner, SquareSpinner } from './styles';


const Spinner = props => (
  props && props.shape === 'round' ? <PulseSpinner /> : <SquareSpinner />
);


Spinner.propTypes = {
  shape: PropTypes.string,
};

export default Spinner;
