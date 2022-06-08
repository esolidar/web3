import Countdown from 'react-countdown';

interface Props {
  date: number;
}

const CountdownTimer = ({ date }: Props) => (
  <Countdown
    autoStart
    date={date}
    renderer={({ days, hours, minutes, seconds, completed }) => {
      if (completed) return 'Completed';
      if (days > 1 && hours > 1)
        return (
          <span>
            {days}d {hours}h
          </span>
        );
      return (
        <span className="">
          {minutes}m {seconds}s
        </span>
      );
    }}
  />
);

export default CountdownTimer;
