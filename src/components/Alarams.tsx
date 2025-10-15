const Alarams = ({ alarms }) => {
  return (
    <div>
      <p className="text-2xl">most recent 10 alarms</p>
      {alarms.map((m) => (
        <p>{m}</p>
      ))}
    </div>
  );
};

export default Alarams;
