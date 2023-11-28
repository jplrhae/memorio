import { IDynamicAllocationData } from "./DynamicAllocationView";

interface ITotalMemoryListProps {
  dynamicAllocationData: IDynamicAllocationData;
  isSimulationRunning: boolean;
}

export default function TotalMemoryList(props: ITotalMemoryListProps) {
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
            justifyContent: "center",
          }}
        >
          {!props.isSimulationRunning
            ? "Total Memory Size: " +
              props.dynamicAllocationData.totalSize +
              "kb"
            : ""}
        </div>
      )}
    </div>
  );
}
