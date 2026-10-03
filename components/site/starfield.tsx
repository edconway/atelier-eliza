const STARS = Array.from({ length: 90 }, (_, index) => ({
  left: `${(index * 137.508) % 100}%`,
  top: `${(index * 83.17) % 100}%`,
  size: index % 9 === 0 ? 3 : index % 4 === 0 ? 2 : 1,
  delay: `${(index % 11) * 0.35}s`,
  opacity: 0.25 + (index % 6) * 0.1,
}));

export function Starfield() {
  return (
    <div className="starfield pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(168,90,140,0.28),_transparent_52%),radial-gradient(ellipse_at_80%_20%,_rgba(120,90,180,0.22),_transparent_45%),radial-gradient(ellipse_at_bottom,_rgba(40,20,70,0.9),_#120814)]" />
      {STARS.map((star, index) => (
        <span
          key={index}
          className="star absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            opacity: star.opacity,
            boxShadow: star.size > 1 ? "0 0 8px rgba(255,220,240,0.8)" : undefined,
          }}
        />
      ))}
    </div>
  );
}
