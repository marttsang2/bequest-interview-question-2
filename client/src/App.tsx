import React, { useEffect, useState } from "react";
import useEncryption from "./hooks/useEncryption";

const API_URL = "http://localhost:8080";

interface Recovery {
  count: number;
  data: string[];
}

function App() {
  const { data, setData, encryptData, decryptData } = useEncryption();
  const [recovery, setRecovery] = useState<Recovery>({ count: 0, data: [] });

  useEffect(() => {
    getData();
    getRecovery();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    const decryptedData = decryptData(data);
    if (decryptedData) {
      setData(decryptedData);
    } else {
      alert("Data is not verified");
    }
  };

  const updateData = async () => {
    try {
      await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ data: encryptData(data) }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      await getData();
      await getRecovery();
    } catch (error) {
      alert("Failed to update data");
    }
  };

  const getRecovery = async () => {
    const response = await fetch(API_URL + "/recover");
    const { data: recoveryData } = await response.json();
    setRecovery({ count: recoveryData.length, data: recoveryData });
  };

  // Verify data from the server
  const verifyData = async () => {
    const response = await fetch(API_URL);
    const { data: serverData } = await response.json();
    const decryptedServerData = decryptData(serverData);
    if (decryptedServerData === data) {
      alert("Data is verified");
    } else {
      alert("Data is not verified");
    }
  };

  // Simulate a hacker tampering with the data
  const tamperData = async () => {
    const response = await fetch(API_URL + "/tamper");
    const { data: tamperedData } = await response.json();
    if (tamperedData) {
      setData(tamperedData);
    } else {
      alert("Failed to tamper data");
    }
    await getRecovery();
  };

  // Recover data from the last backup
  const recoverData = async (index: number) => {
    const response = await fetch(API_URL + "/recover/" + index);
    const { data: recoveredData } = await response.json();
    if (recoveredData) {
      setData(recoveredData);
    } else {
      alert("No backup data found");
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={tamperData}>
          Tamper Data
        </button>
      </div>
      <div>** Backup History ** (From latest to oldest)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "24px" }}>
        {recovery.data.map((data, index) => (
          <div key={index} style={{ display: "flex", gap: "10px" }}>
            {index + 1}. {data}
            <button onClick={() => recoverData(index)}>Recover</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
