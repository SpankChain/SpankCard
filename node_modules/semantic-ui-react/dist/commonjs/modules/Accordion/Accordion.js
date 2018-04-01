'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _keys2 = require('lodash/keys');

var _keys3 = _interopRequireDefault(_keys2);

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var _isFunction2 = require('lodash/isFunction');

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _each2 = require('lodash/each');

var _each3 = _interopRequireDefault(_each2);

var _has2 = require('lodash/has');

var _has3 = _interopRequireDefault(_has2);

var _without2 = require('lodash/without');

var _without3 = _interopRequireDefault(_without2);

var _includes2 = require('lodash/includes');

var _includes3 = _interopRequireDefault(_includes2);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lib = require('../../lib');

var _AccordionContent = require('./AccordionContent');

var _AccordionContent2 = _interopRequireDefault(_AccordionContent);

var _AccordionTitle = require('./AccordionTitle');

var _AccordionTitle2 = _interopRequireDefault(_AccordionTitle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * An accordion allows users to toggle the display of sections of content.
 */
var Accordion = function (_Component) {
  (0, _inherits3.default)(Accordion, _Component);

  function Accordion() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Accordion);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Accordion.__proto__ || Object.getPrototypeOf(Accordion)).call.apply(_ref, [this].concat(args))), _this), _this.handleTitleClick = function (e, index) {
      var _this$props = _this.props,
          onTitleClick = _this$props.onTitleClick,
          exclusive = _this$props.exclusive;
      var activeIndex = _this.state.activeIndex;


      var newIndex = void 0;
      if (exclusive) {
        newIndex = index === activeIndex ? -1 : index;
      } else {
        // check to see if index is in array, and remove it, if not then add it
        newIndex = (0, _includes3.default)(activeIndex, index) ? (0, _without3.default)(activeIndex, index) : [].concat((0, _toConsumableArray3.default)(activeIndex), [index]);
      }
      _this.trySetState({ activeIndex: newIndex });
      if (onTitleClick) onTitleClick(e, index);
    }, _this.isIndexActive = function (index) {
      var exclusive = _this.props.exclusive;
      var activeIndex = _this.state.activeIndex;

      return exclusive ? activeIndex === index : (0, _includes3.default)(activeIndex, index);
    }, _this.renderChildren = function () {
      var children = _this.props.children;

      var titleIndex = 0;
      var contentIndex = 0;

      return _react.Children.map(children, function (child) {
        var isTitle = child.type === _AccordionTitle2.default;
        var isContent = child.type === _AccordionContent2.default;

        if (isTitle) {
          var currentIndex = titleIndex;
          var isActive = (0, _has3.default)(child, 'props.active') ? child.props.active : _this.isIndexActive(titleIndex);
          var onClick = function onClick(e) {
            _this.handleTitleClick(e, currentIndex);
            if (child.props.onClick) child.props.onClick(e, currentIndex);
          };
          titleIndex += 1;
          return (0, _react.cloneElement)(child, (0, _extends3.default)({}, child.props, { active: isActive, onClick: onClick }));
        }

        if (isContent) {
          var _isActive = (0, _has3.default)(child, 'props.active') ? child.props.active : _this.isIndexActive(contentIndex);
          contentIndex += 1;
          return (0, _react.cloneElement)(child, (0, _extends3.default)({}, child.props, { active: _isActive }));
        }

        return child;
      });
    }, _this.renderPanels = function () {
      var panels = _this.props.panels;

      var children = [];

      (0, _each3.default)(panels, function (panel, i) {
        var isActive = (0, _has3.default)(panel, 'active') ? panel.active : _this.isIndexActive(i);
        var onClick = function onClick(e) {
          _this.handleTitleClick(e, i);
          if (panel.onClick) panel.onClick(e, i);
        };

        // implement all methods of creating a key that are supported in factories
        var key = panel.key || (0, _isFunction3.default)(panel.childKey) && panel.childKey(panel) || panel.childKey && panel.childKey || panel.title;

        children.push(_AccordionTitle2.default.create({ active: isActive, onClick: onClick, key: key + '-title', content: panel.title }));
        children.push(_AccordionContent2.default.create({ active: isActive, key: key + '-content', content: panel.content }));
      });

      return children;
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Accordion, [{
    key: 'getInitialAutoControlledState',
    value: function getInitialAutoControlledState(_ref2) {
      var exclusive = _ref2.exclusive;

      return { activeIndex: exclusive ? -1 : [-1] };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          fluid = _props.fluid,
          inverted = _props.inverted,
          panels = _props.panels,
          styled = _props.styled;


      var classes = (0, _classnames2.default)('ui', (0, _lib.useKeyOnly)(fluid, 'fluid'), (0, _lib.useKeyOnly)(inverted, 'inverted'), (0, _lib.useKeyOnly)(styled, 'styled'), 'accordion', className);
      var rest = (0, _omit3.default)(this.props, (0, _keys3.default)(Accordion.propTypes));
      var ElementType = (0, _lib.getElementType)(Accordion, this.props);

      return _react2.default.createElement(
        ElementType,
        (0, _extends3.default)({}, rest, { className: classes }),
        panels ? this.renderPanels() : this.renderChildren()
      );
    }
  }]);
  return Accordion;
}(_lib.AutoControlledComponent);

Accordion.defaultProps = {
  exclusive: true
};
Accordion.autoControlledProps = ['activeIndex'];
Accordion._meta = {
  name: 'Accordion',
  type: _lib.META.TYPES.MODULE
};
Accordion.Content = _AccordionContent2.default;
Accordion.Title = _AccordionTitle2.default;
Accordion.handledProps = ['activeIndex', 'as', 'children', 'className', 'defaultActiveIndex', 'exclusive', 'fluid', 'inverted', 'onTitleClick', 'panels', 'styled'];
exports.default = Accordion;
Accordion.propTypes = process.env.NODE_ENV !== "production" ? {
  /** An element type to render as (string or function). */
  as: _lib.customPropTypes.as,

  /** Index of the currently active panel. */
  activeIndex: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.number), _propTypes2.default.number]),

  /** Primary content. */
  children: _propTypes2.default.node,

  /** Additional classes. */
  className: _propTypes2.default.string,

  /** Initial activeIndex value. */
  defaultActiveIndex: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.number), _propTypes2.default.number]),

  /** Only allow one panel open at a time. */
  exclusive: _propTypes2.default.bool,

  /** Format to take up the width of it's container. */
  fluid: _propTypes2.default.bool,

  /** Format for dark backgrounds. */
  inverted: _propTypes2.default.bool,

  /**
   * Called when a panel title is clicked.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {number} index - The index of the clicked panel.
   */
  onTitleClick: _propTypes2.default.func,

  /**
   * Create simple accordion panels from an array of { text: <string>, content: <custom> } objects.
   * Object can optionally define an `active` key to open/close the panel.
   * Object can opitonally define a `key` key used for title and content nodes' keys.
   * Mutually exclusive with children.
   * TODO: AccordionPanel should be a sub-component
   */
  panels: _lib.customPropTypes.every([_lib.customPropTypes.disallow(['children']), _propTypes2.default.arrayOf(_propTypes2.default.shape({
    key: _propTypes2.default.string,
    active: _propTypes2.default.bool,
    title: _lib.customPropTypes.contentShorthand,
    content: _lib.customPropTypes.contentShorthand,
    onClick: _propTypes2.default.func
  }))]),

  /** Adds some basic styling to accordion panels. */
  styled: _propTypes2.default.bool
} : {};