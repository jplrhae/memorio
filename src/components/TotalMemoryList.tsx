import { IDynamicAllocationData } from "./DynamicAllocationView";

interface ITotalMemoryListProps {
  dynamicAllocationData: IDynamicAllocationData;
  isSimulationRunning: boolean;
  onProgramRemoved: (id: number) => void;
}

export default function TotalMemoryList(props: ITotalMemoryListProps) {
  
  const renderListItems = () => {
    if (!props.isSimulationRunning) {
      return <div>{"Total Memory Size: " +
      props.dynamicAllocationData.totalSize +
      "kb"}</div>
    }

    if (props.dynamicAllocationData.allocatedPrograms) {
      const allocatedProgramsList = props.dynamicAllocationData.allocatedPrograms.map((program) => (
        <div
          key={program.id}
          style={{
            border: "1px dotted #34495e",
            display: "flex",
            backgroundColor: "#2ecc71",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <div style={{ fontWeight: "bold" }}>PR{program.id}</div>
          <div>{program.size}kb</div>
          {program.allocatedIn && (
            <button
              onClick={() => props.onProgramRemoved(program.id)}
              style={{
                backgroundColor: "#e74c3c",
                color: "white",
                padding: "8px",
                borderRadius: "5px",
                cursor: "pointer",
                outline: "none",
                border: "none",
              }}
            >
              kill
            </button>
          )}
          {!props.isSimulationRunning && (
            <button
              onClick={() => props.onProgramRemoved(program.id)}
              style={{
                backgroundColor: "#e74c3c",
                color: "white",
                padding: "8px",
                borderRadius: "5px",
                cursor: "pointer",
                outline: "none",
                border: "none",
              }}
            >
              Remove
            </button>
          )}
        </div>
      ));
      let totalUsedSize = 0;
      props.dynamicAllocationData.allocatedPrograms.forEach((program) => {
        totalUsedSize = totalUsedSize + program.size
      });
  
      console.log("Total used size is", totalUsedSize);
  
      let availableSize = props.dynamicAllocationData.totalSize - totalUsedSize;

      allocatedProgramsList.push(
        <div style={{flexGrow: 1, backgroundColor: "#3498db"}}>{availableSize}KB</div>
      );

      return allocatedProgramsList;

    }

    return <div>No programs allocated</div>
  }

  return (
    <div
      style={{
        border: "1px solid #34495e",
        display: "flex",
        flexDirection: "column",
        width: "400px",
        textAlign: "center",
        borderRadius: "5px",
        overflow: "hidden",
      }}
    >
      {props.dynamicAllocationData.totalSize === 0 ? (
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #34495e",
          }}
        >
          No total size has been set.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: 200,
          }}
        >
          {renderListItems()}
        </div>
      )}
    </div>
  );
}
