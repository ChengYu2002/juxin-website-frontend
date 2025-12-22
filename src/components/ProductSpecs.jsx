// src/components/ProductSpecs.jsx
export default function ProductSpecs({ specs }) {
  if (!specs || Object.keys(specs).length === 0) return null

  return (
    <div className="mt-12">
      <h3 className="mb-3 text-xl font-semibold">Specifications</h3>
      <div className="rounded-xl border bg-gray-50 p-5">
        <table className="w-full">
          <tbody>
            {Object.entries(specs).map(([key, value]) => (
              <tr key={key} className="border-b last:border-b-0">
                <td className="py-2 font-medium capitalize">
                  {key.replaceAll('_', ' ')}:
                </td>
                <td className="py-2 text-gray-700 whitespace-pre-line">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
