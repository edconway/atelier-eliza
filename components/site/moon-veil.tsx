export function MoonVeil() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-[8%] rounded-full bg-rose/20 blur-3xl" />
      <div className="absolute inset-[18%] rounded-full bg-lilac/15 blur-2xl" />
      <div
        className="absolute inset-[22%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 32% 30%, #ffffff 0%, #fff1f6 26%, #f0c9dc 58%, #d9b4e0 100%)",
          boxShadow:
            "0 0 70px rgba(232, 176, 200, 0.35), inset -14px -8px 28px rgba(180, 130, 170, 0.18)",
        }}
      />
      <div className="absolute top-[28%] right-[26%] size-[18%] rounded-full bg-rose/15 blur-sm" />
      <div className="absolute top-[46%] left-[34%] size-[10%] rounded-full bg-lilac/15 blur-[2px]" />
    </div>
  );
}
