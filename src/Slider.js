import * as React from "react";
import { clamp } from "lodash";
import styled from "styled-components";

// type IProps = Readonly<{
//   value: number;
//   maxValue: number;
//   tooltipValues: string[];
//   onChange: (value: number) => void;
//   color: string;
// }>;

// type IState = Readonly<{
//   dragging: boolean;
//   percentage: number;
//   previousValueProp: number;
// }>;

const BAR_HEIGHT = 10;

function isTouchEvent(event) {
  return event.touches !== undefined;
}

const Container = styled.div`
  width: 100%;
  cursor: pointer;
  user-drag: none;
  user-select: none;
  height: 7px;
  padding: 40px 0;
  position: relative;
`;

const UnfilledBar = styled.div`
  position: absolute;
  height: ${BAR_HEIGHT}px;
  width: 100%;
  margin-top: 10px;
  background-color: grey;
  border-radius: 6px;
`;

const ColoredBar = styled.div.attrs(({ percentage }) => ({
  style: {
    transform: `scaleX(${percentage})`,
  },
}))`
  position: absolute;
  height: ${BAR_HEIGHT}px;
  width: 100%;
  margin-top: 10px;
  cursor: pointer;
  transform-origin: 0 0;
  background-color: ${({ color }) => color};
  border-radius: 6px;
  transition: transform 0.45s ease-out;
`;

const CircleTransitionContainer = styled.div.attrs(({ value }) => ({
  style: {
    transform: `translateX(${value}%)`,
  },
}))`
  width: 100%;
  height: ${BAR_HEIGHT}px;
  position: relative;
`;

// interface ICircleProps {
//   color: string;
// }
const Circle = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  height: 28px;
  width: 28px;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  background-color: ${({ color }) => color};
  user-select: none;
  z-index: 10;
  transform: translate(-50%, -50%);
`;

const BiggerCircle = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  cursor: pointer;
  background-color: lightgrey;
  opacity: ${({ dragging }) => (dragging ? 0.3 : 0)};
  z-index: 9;
  transform: translate(-50%, -50%);
  transition: opacity 0.25s ease-out;
  :hover,
  ${Circle}:hover + & {
    opacity: ${({ dragging }) => (dragging ? 0.3 : 0.2)};
  }
`;

const TooltipTransitionContainer = styled(CircleTransitionContainer)`
  /* transition: transform 0.45s ease-out; */
`;

// interface ITooltipProps {
//   dragging: boolean;
//   color: string;
// }
const Tooltip = styled.div`
  position: absolute;
  left: 0;
  bottom: 100%;
  display: flex;
  justify-content: center;
  background: ${({ color }) => color};
  color: #fff;
  text-align: center;
  opacity: ${({ dragging }) => (dragging ? 0.9 : 0)};
  padding: 20px;
  pointer-events: none;
  min-width: 40px;
  z-index: 100;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.28);
  transition: all 0.3s ease-out;
  transform: translate(-50%, ${({ dragging }) => (dragging ? "-25px" : "0px")});
  border-radius: 3px;
  font-weight: bold;
  font-size: 21px;
`;

const Triangle = styled.div`
  position: absolute;
  left: 0;
  border-left: solid transparent 12px;
  border-right: solid transparent 12px;
  border-top: solid ${({ color }) => color} 12px;
  opacity: ${({ dragging }) => (dragging ? 1 : 0)};
  transform: translate(-50%, ${({ dragging }) => (dragging ? "-25px" : "0px")});
  transition: all 0.3s ease-out;
`;

const Notch = styled.div`
  position: absolute;
  top: 50%;
  left: ${({ percentage }) => `${percentage}%`};
  height: 15px;
  width: 15px;
  border-radius: 50%;
  background-color: ${({ active, color }) => (active ? color : "lightgray")};
  margin-top: 11px;
  transform: translate(-50%, -50%);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  transition: background-color 0.45s ease-out;
`;

export default class Slider extends React.Component {
  static defaultProps = {
    tooltipValues: [],
    color: "#FF719A",
  };

  static getDerivedStateFromProps({ value, maxValue }, { previousValueProp }) {
    if (previousValueProp === value) {
      return null;
    }

    return {
      percentage: value / maxValue,
      previousValueProp: value,
    };
  }

  state = {
    dragging: false,
    percentage: this.props.value / this.props.maxValue,
    previousValueProp: this.props.value,
  };

  ref: HTMLElement;

  componentDidMount() {
    window.addEventListener("mousemove", this.handleDrag);
    window.addEventListener("touchmove", this.handleDrag);
    window.addEventListener("touchend", this.handleDragDone);
    window.addEventListener("mouseup", this.handleDragDone);
  }

  handleDrag = (ev) => {
    if (this.state.dragging) {
      const left = this.ref.getBoundingClientRect().left;
      const sliderWidth = this.ref.clientWidth;
      const location = isTouchEvent(ev)
        ? ev.touches[0].clientX - left
        : ev.clientX - left;

      const newPercentage = clamp(location / sliderWidth, 0, 1);
      window.requestAnimationFrame(() => {
        this.setState({ percentage: newPercentage });
        this.props.onChange(this.state.percentage * this.props.maxValue);
      });
    }
  };

  handleDragDone = () => {
    this.setState({ dragging: false });
    this.props.onChange(this.state.percentage * this.props.maxValue);
  };

  handleDragStart = (ev) => {
    const left = this.ref.getBoundingClientRect().left;
    const sliderWidth = this.ref.clientWidth;
    const location = isTouchEvent(ev)
      ? ev.touches[0].clientX - left
      : ev.clientX - left;

    const newPercentage = location / sliderWidth;

    this.setState({ percentage: newPercentage, dragging: true });
  };

  getTooltipText = () => {
    const { tooltipValues } = this.props;
    const { percentage } = this.state;

    const length = tooltipValues.length;

    const index = Math.round((length - 1) * percentage);

    return <div key={index}>{tooltipValues[index]}</div>;
  };

  render() {
    const { color, tooltipValues } = this.props;
    const { dragging, percentage } = this.state;

    return (
      <Container
        ref={(ref) => (this.ref = ref)}
        onMouseDown={this.handleDragStart}
        onTouchStart={this.handleDragStart}
      >
        <UnfilledBar />
        <ColoredBar percentage={percentage} color={color} />

        {tooltipValues.map((tooltip, index) => {
          const tooltipPercentage = index / (tooltipValues.length - 1);

          return (
            <Notch
              key={index}
              percentage={tooltipPercentage * 100}
              color={color}
              active={tooltipPercentage <= percentage}
            />
          );
        })}
        <TooltipTransitionContainer value={percentage * 100}>
          <Tooltip dragging={true} color={color}>
            {this.getTooltipText()}
          </Tooltip>
          <Triangle dragging={true} color={color} />
        </TooltipTransitionContainer>

        <CircleTransitionContainer value={percentage * 100}>
          <Circle
            color={color}
            onMouseDown={this.handleDragStart}
            onTouchStart={this.handleDragStart}
          />
          <BiggerCircle
            dragging={dragging}
            onMouseDown={this.handleDragStart}
            onTouchStart={this.handleDragStart}
          />
        </CircleTransitionContainer>
      </Container>
    );
  }
}
