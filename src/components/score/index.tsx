import React, { PureComponent } from "react";
import Heading from "../heading";
import options from "../../config";

interface ScoreProps {
  points: number;
  label: string;
}

export default class Score extends PureComponent<ScoreProps> {
  get formattedPoints() {
    const { points } = this.props;
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
