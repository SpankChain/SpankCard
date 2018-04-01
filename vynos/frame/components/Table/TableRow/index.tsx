import * as React from 'react'
import * as PropTypes from 'prop-types'

export const TableRow: React.SFC<any> = function(props) {
  const {
    children,
    className,
    ...rest
  } = props

  return (
    <tr
      {...rest}
      className={className}
    >
      {children}
    </tr>
  );
}

TableRow.defaultProps = {
  children: [],
  className: '',
};

TableRow.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
