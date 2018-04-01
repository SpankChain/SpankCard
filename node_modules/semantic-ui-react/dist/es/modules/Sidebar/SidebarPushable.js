import _extends from 'babel-runtime/helpers/extends';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { customPropTypes, getElementType, getUnhandledProps, META } from '../../lib';

/**
 * A pushable sub-component for Sidebar.
 */
function SidebarPushable(props) {
  var className = props.className,
      children = props.children;

  var classes = cx('pushable', className);
  var rest = getUnhandledProps(SidebarPushable, props);
  var ElementType = getElementType(SidebarPushable, props);

  return React.createElement(
    ElementType,
    _extends({}, rest, { className: classes }),
    children
  );
}

SidebarPushable.handledProps = ['as', 'children', 'className'];
SidebarPushable._meta = {
  name: 'SidebarPushable',
  type: META.TYPES.MODULE,
  parent: 'Sidebar'
};

SidebarPushable.propTypes = process.env.NODE_ENV !== "production" ? {
  /** An element type to render as (string or function). */
  as: customPropTypes.as,

  /** Primary content. */
  children: PropTypes.node,

  /** Additional classes. */
  className: PropTypes.string
} : {};

export default SidebarPushable;