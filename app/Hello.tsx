import * as React from 'react';

interface IHelloProps {
  name: string;
}

class Hello extends React.Component<IHelloProps, {}> {
  // tslint:disable-next-line:typedef
  render() {
    return <div>Hello, {this.props.name}</div>;
  }
}

export default Hello;