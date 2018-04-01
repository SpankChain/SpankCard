'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _without2 = require('lodash/without');

var _without3 = _interopRequireDefault(_without2);

var _map2 = require('lodash/map');

var _map3 = _interopRequireDefault(_map2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('../../lib');

var _Step = require('./Step');

var _Step2 = _interopRequireDefault(_Step);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A set of steps.
 */
function StepGroup(props) {
  var children = props.children,
      className = props.className,
      fluid = props.fluid,
      items = props.items,
      ordered = props.ordered,
      size = props.size,
      stackable = props.stackable,
      unstackable = props.unstackable,
      vertical = props.vertical;

  var classes = (0, _classnames2.default)('ui', size, (0, _lib.useKeyOnly)(fluid, 'fluid'), (0, _lib.useKeyOnly)(ordered, 'ordered'), (0, _lib.useKeyOnly)(unstackable, 'unstackable'), (0, _lib.useKeyOnly)(vertical, 'vertical'), (0, _lib.useValueAndKey)(stackable, 'stackable'), 'steps', className);
  var rest = (0, _lib.getUnhandledProps)(StepGroup, props);
  var ElementType = (0, _lib.getElementType)(StepGroup, props);

  if (!_lib.childrenUtils.isNil(children)) {
    return _react2.default.createElement(
      ElementType,
      (0, _extends3.default)({}, rest, { className: classes }),
      children
    );
  }

  var content = (0, _map3.default)(items, function (item) {
    var key = item.key || [item.title, item.description].join('-');
    return _react2.default.createElement(_Step2.default, (0, _extends3.default)({ key: key }, item));
  });

  return _react2.default.createElement(
    ElementType,
    (0, _extends3.default)({}, rest, { className: classes }),
    content
  );
}

StepGroup.handledProps = ['as', 'children', 'className', 'fluid', 'items', 'ordered', 'size', 'stackable', 'unstackable', 'vertical'];
StepGroup._meta = {
  name: 'StepGroup',
  parent: 'Step',
  type: _lib.META.TYPES.ELEMENT
};

StepGroup.propTypes = process.env.NODE_ENV !== "production" ? {
  /** An element type to render as (string or function). */
  as: _lib.customPropTypes.as,

  /** Primary content. */
  children: _propTypes2.default.node,

  /** Additional classes. */
  className: _propTypes2.default.string,

  /** A fluid step takes up the width of its container. */
  fluid: _propTypes2.default.bool,

  /** Shorthand array of props for Step. */
  items: _lib.customPropTypes.collectionShorthand,

  /** A step can show a ordered sequence of steps. */
  ordered: _propTypes2.default.bool,

  /** Steps can have different sizes. */
  size: _propTypes2.default.oneOf((0, _without3.default)(_lib.SUI.SIZES, 'medium')),

  /** A step can stack vertically only on smaller screens. */
  stackable: _propTypes2.default.oneOf(['tablet']),

  /** A step can prevent itself from stacking on mobile. */
  unstackable: _propTypes2.default.bool,

  /** A step can be displayed stacked vertically. */
  vertical: _propTypes2.default.bool
} : {};

exports.default = StepGroup;