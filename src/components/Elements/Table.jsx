export function Cell({ row }) {
  const objectKeys = Object.keys(row);
  return objectKeys.map((key) => <td key={key}>{row[key]}</td>);
}

export default function Table({ data }) {
  return (
    <table className="table-auto border-collapse">
      <thead>
        <tr>
          {Object.keys(data[0]).map((title, idx) => (
            <th className="" key={idx}>
              {title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rkey) => (
          <tr key={rkey}>
            {Object.keys(row).map((rname, ckey) => (
              <td className="px-6 py-3" key={ckey}>
                {rname === "availibilities"
                  ? row[rname].join(", ")
                  : row[rname]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
