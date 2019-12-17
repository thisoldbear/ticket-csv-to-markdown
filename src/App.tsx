import React, { useRef } from 'react';
import csv from 'csvtojson'
import './App.css';

interface CsvResult {
  "Issue Number": string;
  "Repo Name": string;
  "Issue Title": string;
}

const App: React.FC = () => {
  const inputEl = useRef<HTMLInputElement>(null);
  const textAreaEl = useRef<HTMLTextAreaElement>(null);

  const markdownColumns = `Issue | Description | Completed | Who |\n-- | -- | -- | --`

  const repoUrl = `https://github.com/travellocal`

  return (
    <div className="App">
      <header className="App-header">
        <p>Upload the exported CSV issue list</p>
        <div>
          <input
            ref={inputEl}
            type="file"
            id="csv-file"
            name="csv-file"
            accept=".csv"
            onChange={() => {
              if (inputEl.current) {
                const fileList = inputEl.current.files as FileList

                if (fileList) {
                  const file = fileList.item(0) as File

                  const reader = new FileReader();

                  reader.readAsText(file);

                  reader.onload = () => {
                    const csvString = reader.result as string

                    csv().fromString(csvString)
                      .then((result: Array<CsvResult>) => {

                        console.log(result)

                        const issues = result.map((res: CsvResult) =>
                          `[#${res['Issue Number']}](${repoUrl}/${res['Repo Name']}/pull/${res['Issue Number']}) | ${res['Issue Title']} |  |  `)

                        if (textAreaEl.current) {
                          textAreaEl.current.value = `${markdownColumns}\n${issues.join("\n")}`
                        }
                      })
                  }
                }
              }
            }} />
        </div>
        <textarea ref={textAreaEl} />
      </header>
    </div>
  );
}

export default App;
