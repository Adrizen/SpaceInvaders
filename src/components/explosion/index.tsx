import React, { PureComponent } from 'react'
import Sprite from '../sprite'
import options from '../../config'

interface ExplosionProps {
    onAnimationEnd: () => void;
    variant: number ; // 1: alien explosión. 2: player explosión.
    position: number[]; // tupla de coordenadas [x, y].
}

export default class Explosion extends PureComponent<ExplosionProps> {
    //private explosion!: NodeJS.Timeout; // TODO: Esto también está distinto al .js original
    private explosion!: ReturnType<typeof setTimeout>;

    componentDidMount() {
        const { onAnimationEnd } = this.props;
        
        this.explosion = setTimeout(() => {
            onAnimationEnd();
        }, options.explosionDuration);
    }

    componentWillUnmount() {
        clearTimeout(this.explosion);
    }

    render() {
        const { variant, position } = this.props;

        return (
            <Sprite
                image={`explosion${variant}`}
                style={{ position: 'absolute', left: position[0], bottom: position[1] }}
                width={variant === 1 ? options.alienSize : options.cannonSize}
            />
        );
    }
}
