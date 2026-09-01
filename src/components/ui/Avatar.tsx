export function Avatar({ initial }: { initial: string }) {
  const mark = initial.trim().charAt(0).toUpperCase() || '?';
  return (
    <span className="avatar" aria-hidden>
      {mark}
    </span>
  );
}
