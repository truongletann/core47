interface Article {
  content: string;
  time: string | null;
  important: boolean;
}

export function FxtinNewsRow({ article }: { article: Article }) {
  return (
    <div className={`px-4 py-3 ${article.important ? "bg-red-500/5" : ""}`}>
      <span
        className={`font-data inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${
          article.important
            ? "bg-red-500 text-white"
            : "bg-[rgb(var(--border))] text-[rgb(var(--fg))]"
        }`}
      >
        {article.time ?? "—"}
      </span>
      <p
        className={`mt-2 text-sm leading-relaxed ${
          article.important ? "font-medium text-red-500" : "text-[rgb(var(--fg))]"
        }`}
      >
        {article.content}
      </p>
    </div>
  );
}
