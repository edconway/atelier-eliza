export function MoonVeil() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-[8%] rounded-full bg-rose/30 blur-3xl" />
      <div className="absolute inset-[18%] rounded-full bg-lilac/25 blur-2xl" />
      <div
        className="absolute inset-[22%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 32% 30%, #fff6fb 0%, #f3d0e4 28%, #c9a0d8 58%, #6a4a88 100%)",
          boxShadow:
            "0 0 80px rgba(236, 180, 210, 0.45), inset -18px -10px 40px rgba(60, 20, 80, 0.35)",
        }}
      />
      <div className="absolute top-[28%] right-[26%] size-[18%] rounded-full bg-[#5a3a70]/25 blur-sm" />
      <div className="absolute top-[46%] left-[34%] size-[10%] rounded-full bg-[#7a5578]/20 blur-[2px]" />
    </div>
  );
}
