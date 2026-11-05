export default function Card({ className = "p-7", ...props }) {
  return (
    <div
      className={`rounded-xl border border-borda bg-white shadow-card ${className}`}
      {...props}/>
  );
}