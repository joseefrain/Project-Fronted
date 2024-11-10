import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SendHorizonal, SendToBack } from 'lucide-react';
import CustomSelect from './customSelect';
import { updateSelectedBranch } from '@/app/slices/branchSlice';
import { Branch, ITablaBranch } from '@/interfaces/branchInterfaces';
import { useAppSelector } from '@/app/hooks';
import { GetBranches } from '@/shared/helpers/Branchs';
import { store } from '@/app/store';
import { ITool } from '@/interfaces/transferInterfaces';
import {
  getSelectedBranchFromLocalStorage,
  findBranchById,
} from '@/shared/helpers/branchHelpers';
import { Button } from '../../../components/ui/button';

export interface IConsolidatedShipment {
  selectedBranch:
    | (Branch & {
        products: ITablaBranch[];
      })
    | null;
  setDestinationBranch: React.Dispatch<React.SetStateAction<string | null>>;
  setShipmentTools: React.Dispatch<React.SetStateAction<ITool[]>>;
}

export const ConsolidatedShipment = ({
  selectedBranch,
  setDestinationBranch,
  setShipmentTools,
}: IConsolidatedShipment) => {
  const user = useAppSelector((state) => state.auth.signIn.user);
  const branches = useAppSelector((state) => state.branches.data);
  const [sourceBranch, setSourceBranch] = useState<Branch | null>(null);
  const branchIdFromLocalStorage = getSelectedBranchFromLocalStorage();

  useEffect(() => {
    if (branchIdFromLocalStorage) {
      const branch = findBranchById(branches, branchIdFromLocalStorage);
      if (branch) {
        setSourceBranch(branch);
        handleLoadBranch(branch);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branches, branchIdFromLocalStorage]);

  const handleLoadBranch = async (branch: Branch | null) => {
    if (!branch) return store.dispatch(updateSelectedBranch(null));

    const response = await GetBranches(branch._id ?? '');
    store.dispatch(
      updateSelectedBranch({
        ...branch,
        products: response,
      })
    );

    setShipmentTools([]);
  };

  return (
    <Card className="h-[25%]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SendToBack />
          Consolidado de envío
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Button
            type="button"
            className="w-[300px] px-4 py-2 bg-gray-200 text-gray-800 rounded"
            disabled={!sourceBranch}
          >
            {sourceBranch
              ? sourceBranch.nombre
              : user?.sucursalId?.nombre || 'Seleccionar Sucursal'}
          </Button>

          <SendHorizonal />
          <CustomSelect
            sourceBranchId={selectedBranch?._id ?? ''}
            setDestinationBranch={setDestinationBranch}
          />
        </div>
      </CardContent>
    </Card>
  );
};
