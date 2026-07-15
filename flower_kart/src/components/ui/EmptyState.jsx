export const EmptyState = ({
  icon = "deceased",
  title,
  description,
  action,
}) => {
  return (
    <div className="rounded-[32px] border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-slate-950">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
};
