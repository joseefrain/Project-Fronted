import { useAppSelector } from '@/app/hooks';
import { useEffect, useState } from 'react';
import { GetBranches } from '../helpers/Branchs';
import { fetchBranches } from '@/app/slices/branchSlice';
import { store } from '@/app/store';
import { ITablaBranch } from '@/interfaces/branchInterfaces';

export const useFilteredBranches = () => {
  const branches = useAppSelector((state) => state.branches.data);
  const userRoles = useAppSelector((state) => state.auth.signIn.user);
  const [, setProducts] = useState<ITablaBranch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<{
    nombre: string;
    _id: string;
  } | null>(null);

  const filteredBranches =
    userRoles?.role === 'root'
      ? branches
      : branches.filter((branch) => branch._id === userRoles?.sucursalId?._id);

  const fetchData = async () => {
    if (!selectedBranch) return;
    const response = await GetBranches(selectedBranch._id);
    setProducts(response);
  };

  useEffect(() => {
    store.dispatch(fetchBranches()).unwrap();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      fetchData();
    }
  }, [selectedBranch]);

  useEffect(() => {
    if (branches.length === 0) return;
    setSelectedBranch(
      userRoles?.role === 'root'
        ? null
        : {
            nombre: filteredBranches[0].nombre as string,
            _id: filteredBranches[0]._id as string,
          }
    );
  }, [branches]);

  return {
    branches: filteredBranches,
    selectedBranch,
    setSelectedBranch,
  };
};
