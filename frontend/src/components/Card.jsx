export default function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-xl border border-borda bg-white p-7 shadow-card ${className}`}
      {...props}/>
  );
}