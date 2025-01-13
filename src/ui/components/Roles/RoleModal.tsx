import { useState, useEffect } from 'react';
import { DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import PageTree from './PageTree';
import {
  IRole,
  IRoleModalProps,
  IRolePrivilege,
} from '../../../interfaces/roleInterfaces';
import { DEFAULT_ROLE_PAGES } from '../../../shared/helpers/roleHelper';
import { Button } from '../../../components/ui/button';

export default function RoleModal({
  role,
  readonly,
  onSave,
  onClose,
}: IRoleModalProps) {
  const [name, setName] = useState('');
  const [selectedPages, setSelectedPages] = useState<IRolePrivilege[]>([]);

  const handleOnChangeModule = (module: string) => {
    const isSelected = selectedPages.find((p) => p.module === module);

    if (isSelected) {
      setSelectedPages((prev) => prev.filter((p) => p.module !== module));
      return;
    }

    const newModule = DEFAULT_ROLE_PAGES.find((p) => p.module === module);
    setSelectedPages((prev) => [...prev, newModule!]);
  };

  const handleOnChangeLevel = (module: string, level: number) => {
    const isModuleSelected = selectedPages.find((p) => p.module === module);

    if (!isModuleSelected) {
      setSelectedPages([...selectedPages, { module, levels: [level] }]);
      return;
    }

    const isLeveleSelected = isModuleSelected.levels.includes(level);

    if (isLeveleSelected) {
      setSelectedPages((prev) => {
        return prev
          .map((p) => {
            if (p.module === module) {
              const updatedLevels = p.levels.filter((l) => l !== level);
              if (updatedLevels.length === 0) {
                return null;
              }

              return { ...p, levels: updatedLevels };
            }
            return p;
          })
          .filter((p) => p !== null);
      });

      return;
    }

    setSelectedPages((prev) =>
      prev.map((p) =>
        p.module === module ? { ...p, levels: [...p.levels, level] } : p
      )
    );
  };

  const handleOnSave = () => {
    const newRole: IRole = {
      _id: role?._id ?? '',
      name: name,
      privileges: selectedPages,
    };
    onSave(newRole);
  };

  useEffect(() => {
    if (role) {
      setName(role.name);
      setSelectedPages(role.privileges);
    }
  }, [role]);

  return (
    <div
      className={`flex flex-col font-onest h-[70vh] ${readonly ? '' : 'justify-between'}`}
    >
      <DialogHeader className="mb-5">
        <DialogTitle className="font-semibold uppercase">
          {readonly ? 'Ver Rol' : role ? 'Editar Rol' : 'Agregar Rol'}
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-3 mb-5">
        <Label htmlFor="roleName">Nombre del Rol</Label>
        <Input
          id="roleName"
          placeholder="Ej: Administrador"
          value={name}
          onChange={(e) => setName(e.target.value)}
          readOnly={readonly}
          className={`${readonly ? 'bg-gray-200' : ''}`}
        />
      </div>
      <div className="flex flex-col gap-3 mb-5">
        <Label htmlFor="roleName">Permisos de Página</Label>
        <PageTree
          selectedPages={selectedPages}
          readonly={readonly}
          handleOnChangeModule={handleOnChangeModule}
          handleOnChangeLevel={handleOnChangeLevel}
        />
      </div>

      {!readonly && (
        <div className="flex items-center justify-between w-full">
          <Button
            className="bg-gray-400 role__action__btn hover:bg-slate-500"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            className="role__action__btn disabled:cursor-not-allowed"
            onClick={handleOnSave}
            disabled={!name || !selectedPages.length}
          >
            Guardar
          </Button>
        </div>
      )}
    </div>
  );
}
