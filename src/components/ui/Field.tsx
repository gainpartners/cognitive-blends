export function Field({
  label,
  children,
  hideLabel = false,
}: {
  label: string;
  children: React.ReactNode;
  hideLabel?: boolean;
}) {
  return (
    <label className="field">
      <span className={hideLabel ? 'visually-hidden' : undefined}>{label}</span>
      {children}
    </label>
  );
}
