import { useState, ChangeEvent, FormEvent } from "react";

interface IProgramsFormProps {
  onAddProgram: (size: number) => void;
  onClearPrograms: () => void;
}

export default function ProgramsController(props: IProgramsFormProps) {
  const [programSize, setProgramSize] = useState<number>(0);

  const handleSizeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSize = parseFloat(event.target.value);
    setProgramSize(newSize);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (programSize > 0) {
      props.onAddProgram(programSize);
      setProgramSize(0);
    } else {
      props.onAddProgram(Math.floor(Math.random() * 10) + 1);
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
          Program Size (KB):
          <input
            type="number"
            value={programSize}
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
          disabled={programSize <= 0}
          style={{
            backgroundColor: programSize <= 0 ? "#7f8c8d" : "#3498db",
            color: programSize <= 0 ? "black" : "white",
            padding: "10px",
            borderRadius: "5px",
            cursor: programSize > 0 ? "pointer" : "not-allowed",
            outline: "none",
            border: "none",
          }}
        >
          Add Program
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
          Add Random Program
        </button>
      </form>
      <button
        onClick={() => props.onClearPrograms()}
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
        Clear All Programs
      </button>
    </>
  );
}
