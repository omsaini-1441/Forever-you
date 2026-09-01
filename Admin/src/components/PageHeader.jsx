const PageHeader = ({ title, subtitle, count }) => (
  <div className="mb-6 pb-4 border-b border-gray-200">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">{subtitle}</p>
        )}
      </div>
      {count !== undefined && (
        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
          {count} total
        </span>
      )}
    </div>
  </div>
);

export default PageHeader;
