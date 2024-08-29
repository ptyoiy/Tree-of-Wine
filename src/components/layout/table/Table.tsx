/* eslint-disable react-hooks/exhaustive-deps */
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridPagination,
  GridRowSelectionModel,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { useCallback, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { wineSelectionAtom, wineSelectionSelector } from '../../../recoil/search';
import { WineData } from '../../../utils/makeTree';
const columns: GridColDef<WineData[][number]>[] = [
  { field: 'Country', headerName: 'Country', width: 90 },
  {
    field: 'Region',
    headerName: 'Region',
    width: 110,
  },
  {
    field: 'Designation',
    headerName: 'Designation',
    width: 110,
  },
  // {
  //   field: 'age',
  //   headerName: 'Age',
  //   type: 'number',
  //   width: 110,
  // },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  // },
];

export default function Table() {
  const setSelection = useSetRecoilState(wineSelectionAtom);
  const rows = useRecoilValue(wineSelectionSelector);
  const [selectedRows, setSelectedRows] = useState<GridValidRowModel[]>([]);

  const handleRowSelection = useCallback(
    (_idx: GridRowSelectionModel, details: GridCallbackDetails) => {
      setSelectedRows([...details.api.getSelectedRows().values()]);
    },
    []
  );
  // 선택된 행 삭제 핸들러
  const handleDelete = useCallback(() => {
    setSelection((prevSelection) => prevSelection.difference(new Set(selectedRows)));
    setSelectedRows([]); // 삭제 후 선택 해제
  }, [selectedRows]);

  return (
    <DataGrid
      sx={{ height: `33%` }}
      density="compact"
      rows={rows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      slots={{
        pagination() {
          return (
            <div style={{ display: 'flex' }}>
              <Button
                sx={{ minWidth: 'fit-content', padding: 0 }}
                disabled={!selectedRows.length}
                onClick={handleDelete}
              >
                <DeleteIcon />
              </Button>
              <GridPagination />
            </div>
          );
        },
      }}
      pageSizeOptions={[5]}
      checkboxSelection
      disableRowSelectionOnClick
      onRowSelectionModelChange={handleRowSelection}
    />
  );
}
