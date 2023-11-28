import { useState, ChangeEvent, FormEvent } from "react";

interface ITotalMemoryControllerProps {
  onSetTotalSize: (size: number) => void;
  onClearTotalSize: () => void;
}

export default function TotalMemoryController(
  props: ITotalMemoryControllerProps
) {
  const [totalSize, setTotalSize] = useState<number>(0);

  const handleSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSize = parseFloat(event.target.value);
    setTotalSize(newSize);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (totalSize > 0) {
      props.onSetTotalSize(totalSize);
      setTotalSize(0);
    } else {
      props.onSetTotalSize(Math.floor(Math.random() * 20) + 1);
    }
  };

  return (
    <>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          backgroundColor: "#2c3e50",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 5px 5px rgba(0, 0, 0, 0.1)",
        }}
        onSubmit={handleSubmit}
      >
        <label style={{ color: "white" }}>
          Total Memory Size (KB):
          <input
            type="number"
            value={totalSize}
            onChange={handleSizeChange}
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #34495e",
            }}
          />
        </label>
        <button
          type="submit"
          disabled={totalSize <= 0}
          style={{
            backgroundColor: totalSize <= 0 ? "#7f8c8d" : "#3498db",
            color: totalSize <= 0 ? "black" : "white",
            padding: "10px",
            borderRadius: "5px",
            cursor: totalSize > 0 ? "pointer" : "not-allowed",
            outline: "none",
            border: "none",
          }}
        >
          Set Total Size
        </button>
        <button
          type="submit"
          style={{
            backgroundColor: "#2ecc71",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
            outline: "none",
            border: "none",
          }}
        >
          Set Random Total Size
        </button>
      </form>
      <button
        onClick={() => props.onClearTotalSize()}
        style={{
          backgroundColor: "#e74c3c",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          cursor: "pointer",
          outline: "none",
          border: "none",
        }}
      >
        Clear Total Size
      </button>
    </>
  );
}
