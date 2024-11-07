import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SendHorizonal, SendToBack } from 'lucide-react';
import CustomSelect from './customSelect';
import { updateSelectedBranch } from '@/app/slices/branchSlice';
import { Branch, ITablaBranch } from '@/interfaces/branchInterfaces';
import { useAppSelector } from '@/app/hooks';
import { GetBranches } from '@/shared/helpers/Branchs';
import { store } from '@/app/store';
import { ITool } from '@/interfaces/transferInterfaces';
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [sourceBranch, setSourceBranch] = useState<Branch | null>(null);

  const handleLoadBranch = async (branch: Branch | null) => {
    if (!branch) return store.dispatch(updateSelectedBranch(null));

    if (branch) {
      const response = await GetBranches(branch._id ?? '');

      store.dispatch(
        updateSelectedBranch({
          ...branch,
          products: response,
        })
      );
    }

    setShipmentTools([]);
  };

  const handleChangeBranch = (branch: Branch | null) => {
    handleLoadBranch(branch);
    setSourceBranch(branch);
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
          {user?.sucursalId ? (
            <Select>
              <SelectTrigger className="w-[300px]" disabled>
                <SelectValue placeholder={user.sucursalId.nombre} />
              </SelectTrigger>
            </Select>
          ) : (
            <CustomSelect
              sourceBranchId={sourceBranch?._id ?? ''}
              handleBranchSelect={handleChangeBranch}
            />
          )}
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
