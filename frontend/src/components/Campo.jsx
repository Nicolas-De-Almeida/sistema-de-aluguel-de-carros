export default function Campo({ id, rotulo, erro, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold">
        {rotulo}
      </label>
      <input
        id={id}
        name={id}
        className={`h-12 w-full rounded-[10px] border bg-white px-3.5 text-[15px] placeholder:text-gray-400 focus:border-marca-600 focus:ring-2 focus:ring-marca-600/30 focus:outline-none ${
          erro ? "border-perigo" : "border-borda"
        }`}
        {...props}/>
      {erro && <p className="text-[13px] text-perigo">{erro}</p>}
    </div>
  );
}