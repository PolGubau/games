function Food({ position }: { position: { x: number; y: number } }) {
  return (
    <div
      className="food bg-primary-100 w-[15px] h-[15px] z-0 absolute m-[3px] rounded-full animate-ping"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    />
  );
}

export default Food;
