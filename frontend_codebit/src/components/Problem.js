export default function Problem({problem}) {
    return (
        <div>
         <h2 className="text-2xl font-bold text-blue-700">{problem.title}</h2>
            <p className="mt-2 text-gray-700">{problem.description}</p>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-600">Input Format:</h3>
              <p className="text-gray-700">{problem.inputFormat}</p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-600">Output Format:</h3>
              <p className="text-gray-700">{problem.outputFormat}</p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-600">Constraints:</h3>
              <p className="text-gray-700">{problem.constraints}</p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-600">Examples:</h3>
          
              { problem.examples&& problem.examples.map((example, index) => (
                <div key={index} className="p-3 border rounded-lg bg-white shadow-md my-2">
                  <p>
                  
                    <strong>Input:</strong> <span className="bg-white p-1 rounded">{example.input}</span>
                  </p>
                  <p>
                    <strong>Output:</strong> <span className="bg-white p-1 rounded">{example.output}</span>
                  </p>
                  <p>
                    <strong>Explanation:</strong> <span className="bg-white p-1 rounded">{example.explanation}</span>
                  </p>
                </div>
              ))}
            </div>
          
          
        </div>
    );
}