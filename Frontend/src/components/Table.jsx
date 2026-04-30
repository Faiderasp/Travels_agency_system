import React from 'react';

const Table = ({ headers, data, onEdit, onDelete }) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-xl transition-all hover:shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-violet-50 text-xs font-bold uppercase text-violet-700">
            <tr>
              {headers.map((header, index) => (
                <th key={index} scope="col" className="px-6 py-4 tracking-wider">
                  {header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th scope="col" className="px-6 py-4 tracking-wider text-center">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-violet-50">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className="group transition-colors hover:bg-violet-50/50"
                >
                  {headers.map((header, cellIndex) => {
                    const key = header.toLowerCase().replace(/\s+/g, '_');
                    const cellValue = row[key] || row[header] || Object.values(row)[cellIndex];
                    
                    return (
                      <td key={cellIndex} className="whitespace-nowrap px-6 py-4 text-gray-600 transition-colors group-hover:text-violet-900">
                        {cellValue}
                      </td>
                    );
                  })}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        {onEdit && (
                          <button 
                            onClick={() => onEdit(row)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        )}
                        {onDelete && (
                          <button 
                            onClick={() => onDelete(row)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-10 text-center text-gray-400 italic">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default Table;
