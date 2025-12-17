interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function Card({ title, description, children }: Props) {
  return (
    <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 space-y-4">
      <header>
        <h3 className="text-lg font-semibold text-gray-800">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>
        )}
      </header>

      <div>
        {children}
      </div>
    </section>
  );
}
