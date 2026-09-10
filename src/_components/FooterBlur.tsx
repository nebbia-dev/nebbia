export function FooterBlur() {
  return (
    <div
      aria-hidden="true"
      className="h-[140px] w-full backdrop-blur-md"
      style={{
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.35) 18%, rgba(0, 0, 0, 0.7) 36%, #000 60%)',
        maskImage:
          'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.35) 18%, rgba(0, 0, 0, 0.7) 36%, #000 60%)',
      }}
    />
  );
}
