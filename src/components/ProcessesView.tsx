import React from "react";

export default function ProcessesView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <button>Add process</button>
      <div
        style={{
          border: "1px solid black",
          display: "flex",
          flexDirection: "column",
          width: "400px",
          textAlign: "center",
          borderRadius: "5px",
        }}
      >
        <div style={{ border: "1px dotted black" }}>2kb</div>
        <div style={{ border: "1px dotted black" }}>1kb</div>
        <div style={{ border: "1px dotted black" }}>1kb</div>
        <div style={{ border: "1px dotted black" }}>5kb</div>
        <div style={{ border: "1px dotted black" }}>6kb</div>
      </div>
    </div>
  );
}
