const STARS = Array.from({ length: 48 }, (_, index) => ({
  left: `${(index * 137.508) % 100}%`,
  top: `${(index * 83.17) % 100}%`,
  size: index % 9 === 0 ? 2 : 1,
  delay: `${(index % 11) * 0.35}s`,
  opacity: 0.12 + (index % 6) * 0.04,
}));

export function Starfield() {
  return (
    <div className="starfield pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(244,214,228,0.55),_transparent_48%),radial-gradient(ellipse_at_85%_12%,_rgba(228,220,244,0.4),_transparent_42%),linear-gradient(180deg,_#fffaf8_0%,_#fff8fb_48%,_#f7f1f6_100%)]" />
      {STARS.map((star, index) => (
        <span
          key={index}
          className="star absolute rounded-full bg-rose/50"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}
