import { Branch } from '../../interfaces/branchInterfaces';

export const getSelectedBranchFromLocalStorage = (): string | null => {
  let selectedBranch = localStorage.getItem('selectedBranch');
  return selectedBranch ? selectedBranch.replace(/"/g, '') : null;
};

export const findBranchById = (
  branches: Branch[],
  branchId: string | null
): Branch | null => {
  if (!branchId) return null;
  return branches.find((branch) => branch._id === branchId) ?? null;
};

export const getFilteredBranches = (
  branches: Branch[],
  userRole: string,
  selectedBranchId: string | null
): Branch[] => {
  if (userRole === 'root') {
    return branches;
  }
  return branches.filter((branch) => branch._id === selectedBranchId);
};

export const filterBranchesBySourceId = (
  branches: Branch[],
  sourceId: string
): Branch[] => {
  return branches.filter((branch) => branch._id !== sourceId);
};
