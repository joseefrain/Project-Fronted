import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchAndFilterProps {
  searchTerm: string;
  placeholder?: string;
  setSearchTerm: (term: string) => void;
}

export const SearchComponent = ({
  searchTerm,
  placeholder,
  setSearchTerm,
}: SearchAndFilterProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={placeholder || 'Buscar productos...'}
            className="pl-8 w-[200px] lg:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
