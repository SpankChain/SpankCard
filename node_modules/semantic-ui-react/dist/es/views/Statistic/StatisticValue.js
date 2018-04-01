import _extends from 'babel-runtime/helpers/extends';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { childrenUtils, customPropTypes, getElementType, getUnhandledProps, META, useKeyOnly } from '../../lib';

/**
 * A statistic can contain a numeric, icon, image, or text value.
 */
function StatisticValue(props) {
  var children = props.children,
      className = props.className,
      text = props.text,
      value = props.value;


  var classes = cx(useKeyOnly(text, 'text'), 'value', className);
  var rest = getUnhandledProps(StatisticValue, props);
  var ElementType = getElementType(StatisticValue, props);

  return React.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    childrenUtils.isNil(children) ? value : children
  );
}

StatisticValue.handledProps = ['as', 'children', 'className', 'text', 'value'];
StatisticValue._meta = {
  name: 'StatisticValue',
  parent: 'Statistic',
  type: META.TYPES.VIEW
};

StatisticValue.propTypes = process.env.NODE_ENV !== "production" ? {
  /** An element type to render as (string or function). */
  as: customPropTypes.as,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Format the value with smaller font size to fit nicely beside number values. */
  text: PropTypes.bool,

  /** Primary content of the StatisticValue. Mutually exclusive with the children prop. */
  value: customPropTypes.contentShorthand
} : {};

export default StatisticValue;