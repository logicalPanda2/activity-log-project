export default function Button({
    onClick,
    text,
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className="px-4 py-1 mx-2 bg-blue-600 text-white hover:bg-blue-600/75 active:bg-blue-600/50 rounded transition"
        >
            {text}
        </button>
    );
}