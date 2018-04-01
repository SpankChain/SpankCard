import * as React from 'react';
import {FormEvent} from 'react'

export interface SubmittableProps {
  onSubmit: (e: FormEvent<any>) => void
  className?: string
}

export default class Submittable extends React.Component<SubmittableProps, {}> {
  render() {
    return (
      <form onSubmit={(e: FormEvent<any>) => this.onSubmit(e)} className={this.props.className || ''}>
        {this.props.children}
      </form>
    );
  }

  onSubmit (e: FormEvent<any>) {
    e.preventDefault()
    this.props.onSubmit(e)
  }
}
