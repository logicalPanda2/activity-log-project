export default function Button({
    onClick,
    text,
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className="px-4 py-1.5 border border-solid border-black rounded mx-2 bg-neutral-100 hover:bg-neutral-100/75 active:bg-neutral-200 transition"
        >
            {text}
        </button>
    );
}