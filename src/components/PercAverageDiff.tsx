interface PercAverageDiffProps {
  percentageDiff: number;
}

function PercAverageDiff({ percentageDiff }: PercAverageDiffProps) {
  if (percentageDiff > 0) {
    return (
      <small className="avg_up">
        ↑ ${Math.abs(Math.round(percentageDiff))}% above average
      </small>
    );
  } else if (percentageDiff < 0) {
    return (
      <small className="avg_down">
        ↓ ${Math.abs(Math.round(percentageDiff))}% below average
      </small>
    );
  } else {
    return <small> → </small>;
  }
}

export default PercAverageDiff;
