import { initials } from "@/lib/format";

export function Avatar({
  name,
  colorPair,
  size = 40,
}: {
  name: string;
  colorPair?: string;
  size?: number;
}) {
  const [c1, c2] = (colorPair ?? "#2563EB,#7C3AED").split(",");
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white shadow-inner"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
      }}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
