// Har subject ka icon + accent color. Backend sirf subject ka naam bhejta hai,
// yahan use decorate karte hain. Naya subject aaye to yaha add kar do.
export type SubjectMeta = { emoji: string; color: string };

const META: Record<string, SubjectMeta> = {
  Maths: { emoji: "📐", color: "#38d9c4" },
  Science: { emoji: "🔬", color: "#22c55e" },
  "Social Science": { emoji: "🌍", color: "#f5b544" },
  English: { emoji: "📖", color: "#9b86ff" },
  Hindi: { emoji: "✍️", color: "#ff8fa3" },
};

export function subjectMeta(name: string): SubjectMeta {
  return META[name] ?? { emoji: "📚", color: "#38d9c4" };
}
