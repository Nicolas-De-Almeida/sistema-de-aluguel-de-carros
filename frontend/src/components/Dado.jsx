export default function Dado({ rotulo, valor }) {
    return (
        <div>
            <p className="text-[13px] tracking-wide text-suave uppercase">{rotulo}</p>
            <p className="mt-1 font-semibold">{valor}</p>
        </div>
    );
}