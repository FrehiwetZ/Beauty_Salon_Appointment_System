export default function Card({ title, description, className = "" }) {
  return (
    <div className={`p-6 rounded-lg bg-cyan-600 min-h-[250px] flex flex-col space-y-4 max-w-sm  ${className}`}>
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      {description && <p className="text-gray-600">{description}</p>}
    </div>
  );
}
