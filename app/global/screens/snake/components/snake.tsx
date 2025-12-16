function Snake({ snake }: { snake: { x: number; y: number }[] }) {
  return (
    <div>
      {snake.map((box, i) => (
        <div
          key={i}
          className="bg-primary w-[15px] h-[15px] rounded-sm z-1 absolute m-[5px]"
          style={{
            filter: `brightness(${100 + i * 5}%)`,
            left: `${box.x}%`,
            top: `${box.y}%`,
          }}
        />
      ))}
    </div>
  );
}

export default Snake;
