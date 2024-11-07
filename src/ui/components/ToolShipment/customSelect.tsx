import { useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Branch } from '@/interfaces/branchInterfaces';

export interface ICustomSelect {
  sourceBranchId: string;
  setDestinationBranch?: (id: string | null) => void;
  handleBranchSelect?: (branch: Branch | null) => void;
}

const CustomSelect = ({
  setDestinationBranch,
  sourceBranchId,
  handleBranchSelect,
}: ICustomSelect) => {
  const branches = useAppSelector((state) => state.branches.data);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Branch | null>(
    null
  );

  const filteredWarehouses = branches.filter(
    (warehouse) => sourceBranchId !== warehouse._id
  );

  const handleSelectChangeBranch = (value: string) => {
    const branch = branches.find((b) => b._id === value);
    if (branch) {
      setSelectedWarehouse(branch);
      setDestinationBranch && setDestinationBranch(branch._id ?? null);
      handleBranchSelect && handleBranchSelect(branch);
    } else {
      setSelectedWarehouse(null);
      setDestinationBranch && setDestinationBranch(null);
      handleBranchSelect && handleBranchSelect(null);
    }
  };

  return (
    <Select onValueChange={handleSelectChangeBranch}>
      <SelectTrigger className="w-[300px]">
        <SelectValue placeholder="Seleccione Sucursal">
          {selectedWarehouse?.nombre ?? ''}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {filteredWarehouses.map((branch) => (
          <SelectItem key={branch._id} value={branch._id as string}>
            {branch.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
