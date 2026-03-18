interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onAdd?: () => void;
  addLabel?: string;
  showAdd?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  onAdd,
  addLabel = "+ Adicionar",
  showAdd = false,
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-white/50 text-sm mt-1">{subtitle}</p>}
      </div>
      {showAdd && onAdd && (
        <button
          onClick={onAdd}
          className="bg-[#3770db] hover:bg-[#3770db]/80 text-white font-semibold px-6 py-2.5 rounded-lg transition shadow"
        >
          {addLabel}
        </button>
      )}
    </div>
  );
}
