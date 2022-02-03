import { doc, updateDoc } from "firebase/firestore";
import MaterialTable from "material-table";
import React from "react";
import { useFirestore, useFirestoreDocData } from "reactfire";
import { CausalityData } from "../types";

interface Props {
  currentProcedure: string;
}

const CausalityEditor: React.FC<Props> = (props) => {
  const { currentProcedure } = props;
  const firestore = useFirestore();
  const ref = doc(firestore, "procedures", currentProcedure);
  const { data: document } = useFirestoreDocData(ref, {
    idField: "key",
  });

  const addTableRow = async (newData: any): Promise<void> => {
    console.log("ADD");
    const currentCausalityData = document.causalityData;
    const dataUpdate = currentCausalityData as CausalityData[];
    const causalityData = newData as unknown as CausalityData;
    causalityData.id = currentCausalityData.length + 1;

    dataUpdate.push(causalityData as CausalityData);
    await updateDoc(doc(firestore, "procedures", currentProcedure), {
      causalityData: dataUpdate,
    });
  };

  const updateTableRow = async (newData: any, oldData: any): Promise<void> => {
    if (oldData) {
      const dataUpdate = document.causalityData;
      const index = oldData.tableData.id;
      dataUpdate[index] = newData;

      await updateDoc(doc(firestore, "procedures", currentProcedure), {
        causalityData: dataUpdate,
      });
    }
  };

  const deleteTableRow = async (oldData: any): Promise<void> => {
    if (oldData) {
      const dataDelete = document.causalityData!;
      const index = oldData.tableData.id;
      dataDelete.splice(index, 1);
      await updateDoc(doc(firestore, "procedures", currentProcedure), {
        causalityData: dataDelete,
      });
    }
  };

  return (
    <div style={{ border: "1px solid black", height: "600px", width: "100%" }}>
      <MaterialTable
        options={{
          paging: false,
          search: false,
        }}
        title="Causality editor"
        columns={[
          {
            title: "Causality",
            field: "causality",
          },
          {
            title: "Value",
            field: "value",
          },
        ]}
        data={
          document &&
          document.causalityData.map((obj: CausalityData[]) => ({
            ...obj,
          }))
        }
        parentChildData={(row, rows) => rows.find((o) => o.id === row.parentId)}
        editable={{
          onRowAdd: (newData: any) => addTableRow(newData),
          onRowUpdate: (newData: any, oldData: any) =>
            new Promise((resolve: any, reject) => {
              setTimeout(() => {
                updateTableRow(newData, oldData);
                resolve();
              }, 0);
            }),
          onRowDelete: (oldData: any) => deleteTableRow(oldData),
        }}
      />
    </div>
  );
};

export default CausalityEditor;
