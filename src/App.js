import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [hostname, setHostname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    console.log("Renderer process loaded");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    sshConnect(hostname, username, password);
  };

  const sshConnect = async (hostname, username, password) => {
    try {
      const sshOutput = await window.electron.ipcRenderer.invoke(
        "ssh-connect",
        {
          hostname,
          username,
          password,
        }
      );
      setOutput(sshOutput);
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
  };

  return (
    <div className="App">
      <h1>SSH Connection</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Hostname:
          <input
            type="text"
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
          />
        </label>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Connect</button>
      </form>
      <h2>Output</h2>
      <pre>{output}</pre>
    </div>
  );
}

export default App;
