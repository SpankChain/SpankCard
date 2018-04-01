import _extends from 'babel-runtime/helpers/extends';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { childrenUtils, createShorthand, customPropTypes, getElementType, getUnhandledProps, META } from '../../lib';
import StepDescription from './StepDescription';
import StepTitle from './StepTitle';

/**
 * A step can contain a content.
 */
function StepContent(props) {
  var children = props.children,
      className = props.className,
      description = props.description,
      title = props.title;

  var classes = cx('content', className);
  var rest = getUnhandledProps(StepContent, props);
  var ElementType = getElementType(StepContent, props);

  if (!childrenUtils.isNil(children)) {
    return React.createElement(
      ElementType,
      _extends({}, rest, { className: classes }),
      children
    );
  }

  return React.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    createShorthand(StepTitle, function (val) {
      return { title: val };
    }, title),
    createShorthand(StepDescription, function (val) {
      return { description: val };
    }, description)
  );
}

StepContent.handledProps = ['as', 'children', 'className', 'description', 'title'];
StepContent._meta = {
  name: 'StepContent',
  parent: 'Step',
  type: META.TYPES.ELEMENT
};

StepContent.propTypes = process.env.NODE_ENV !== "production" ? {
  /** An element type to render as (string or function). */
  as: customPropTypes.as,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string,

  /** Shorthand for StepDescription. */
  description: customPropTypes.itemShorthand,

  /** Shorthand for StepTitle. */
  title: customPropTypes.itemShorthand
} : {};

export default StepContent;