import { PureComponent } from "react";
import Alien from "../alien";

interface AlienConfig {
  id: number;
  t: string; // Tipo de alien.
  x: number; // Posición izquierda.
  y: number; // Posición inferior.
}

interface AliensGridProps {
  config: AlienConfig[]; // Arreglo de configuración de aliens.
}

interface AliensGridState {
  variant: number;  // Variante de alien (cambia el sprite).
}

export default class AliensGrid extends PureComponent<AliensGridProps, AliensGridState> {
  state: AliensGridState = {
    variant: 2,
  };

  componentDidUpdate(prevProps: AliensGridProps, prevState: AliensGridState) {
    if (prevProps.config.length === this.props.config.length) {
      this.setState({ variant: prevState.variant === 2 ? 1 : 2 });
    }
  }

  renderAliens() {
    const { variant } = this.state;
    const { config } = this.props;

    return config.map((el, ind) => (
      <Alien
        key={el.id}
        id={el.id}
        type={el.t}
        variant={variant}
        left={el.x}
        bottom={el.y}
      />
    ));
  }

  render() {
    return this.renderAliens();
  }
}
