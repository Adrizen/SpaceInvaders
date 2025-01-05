import { PureComponent } from "react";
import Heading from "../heading";
import options from "../../config";

interface ScoreProps {
  points: number;
  label: string;
}

// Corresponde al NÚMERO mostrado que refleja el puntaje del jugador.
export default class Score extends PureComponent<ScoreProps> {
  get formattedPoints() {
    const { points } = this.props;
    // Rellenar el score con 0 hasta llegar a 4 dígitos.
    return points.toString().padStart(4, "0");
  }

  render() {
    const { label } = this.props;

    return (
      <Heading upperCase>
        {label}:{" "}
        <Heading color={options.mainColor}>{this.formattedPoints}</Heading>
      </Heading>
    );
  }
}
