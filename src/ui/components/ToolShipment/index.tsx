import { useAppSelector } from '@/app/hooks';
import { fetchBranches, updateSelectedBranch } from '@/app/slices/branchSlice';
import { store } from '@/app/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TabsContent } from '@/components/ui/tabs';
import { ITool } from '@/interfaces/transferInterfaces';
import { GetBranches } from '@/shared/helpers/Branchs';
import { Boxes, PlusCircle, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ConsolidatedShipment } from './consolidatedShipment';
import './styles.scss';
import { SummaryTools } from './summaryTools';
import { ToolTransfer } from './toolTransfer';

export default function ToolShipment() {
  const user = useAppSelector((state) => state.auth.signIn.user);
  const { selectedBranch, loading } = useAppSelector((state) => state.branches);
  const [destinationBranch, setDestinationBranch] = useState<string | null>(
    null
  );
  const [tools, setTools] = useState<ITool[]>([]);
  const [shipmentTools, setShipmentTools] = useState<ITool[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = tools.filter((tool) =>
    tool.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuantityChange = (id: string, quantity: number) => {
    const updatedTools = tools.map((tool) =>
      tool.id === id ? { ...tool, quantityToSend: quantity } : tool
    );
    setTools(updatedTools);
  };

  const handleShipmentTool = (tool: ITool) => {
    if (tool.quantityToSend <= 0) {
      return;
    }

    const updatedTools = tools.map((tl) =>
      tl.id === tool.id
        ? { ...tl, stock: tl.stock - tool.quantityToSend, quantityToSend: 0 }
        : tl
    );

    let updatedShipmentTools = shipmentTools.map((tl) =>
      tl.id === tool.id
        ? { ...tl, quantityToSend: tl.quantityToSend + tool.quantityToSend }
        : tl
    );
    const isShipmentTool = updatedShipmentTools.find((st) => st.id === tool.id);
    if (!isShipmentTool) {
      updatedShipmentTools = [...updatedShipmentTools, tool];
    }

    setShipmentTools(updatedShipmentTools);
    setTools(updatedTools);
  };

  const handleRemoveShipmentTool = (tool: ITool) => {
    const updatedTools = tools.map((tl) =>
      tl.id === tool.id ? { ...tl, stock: tl.stock + tool.quantityToSend } : tl
    );

    const updatedShipmentTools = shipmentTools.filter(
      (st) => st.id !== tool.id
    );

    setShipmentTools(updatedShipmentTools);
    setTools(updatedTools);
  };

  const handleRemoveComment = (tool: ITool) => {
    const updatedTools = shipmentTools.map((tl) =>
      tl.id === tool.id ? { ...tl, comment: null } : tl
    );

    setShipmentTools(updatedTools);
  };

  const handleSaveComment = (toolId: string, comment: string) => {
    const updatedTools = shipmentTools.map((tl) =>
      tl.id === toolId ? { ...tl, comment: comment } : tl
    );

    setShipmentTools(updatedTools);
  };

  const handleSaveImages = (toolId: string, images: string[]) => {
    const updatedTools = shipmentTools.map((tl) =>
      tl.id === toolId ? { ...tl, gallery: images } : tl
    );

    setShipmentTools(updatedTools);
  };

  const handleLoadBranch = async () => {
    if (user?.sucursalId?._id) {
      const response = await GetBranches(user.sucursalId._id);

      store.dispatch(
        updateSelectedBranch({
          ...user.sucursalId,
          products: response,
        })
      );
    } else {
      store.dispatch(updateSelectedBranch(null));
    }
  };

  useEffect(() => {
    if (!selectedBranch) return setTools([]);
    const formattedTools = selectedBranch.products.map((tool) => ({
      ...tool,
      quantityToSend: 0,
      comment: null,
      gallery: [],
    }));
    setTools(formattedTools);
  }, [selectedBranch]);

  useEffect(() => {
    store.dispatch(fetchBranches()).unwrap();
    handleLoadBranch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto font-onest">
      <TabsContent value="send">
        <div className="branch__grid">
          <Card className="product__list">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Boxes size={20} />
                <CardTitle>Products</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nombre herramientas..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Herramientas</TableHead>
                    <TableHead>Stock mínimo</TableHead>
                    <TableHead>Disponible</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading &&
                    [1, 2, 3, 4, 5].map((item) => (
                      <ShipmentSkeleton key={item} />
                    ))}
                  {!loading &&
                    filteredTools.map((tool) => (
                      <TableRow key={tool.id}>
                        <TableCell>{tool.nombre}</TableCell>
                        <TableCell className="text-center">
                          {tool?.puntoReCompra}
                        </TableCell>
                        <TableCell
                          className={` text-center ${Number(tool.puntoReCompra) >= tool.stock ? 'text-red-500 font-semibold' : ''}`}
                        >
                          {tool.stock}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={tool.quantityToSend}
                            onChange={(e) =>
                              handleQuantityChange(
                                tool.id!,
                                parseInt(e.target.value)
                              )
                            }
                            min={0}
                            max={tool.stock}
                            className="w-[80%]"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            disabled={tool.quantityToSend <= 0}
                            variant="default"
                            onClick={() => handleShipmentTool(tool)}
                            className="w-[40px] flex items-center justify-center"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="branch__consolidate">
            <ConsolidatedShipment
              selectedBranch={selectedBranch}
              setDestinationBranch={setDestinationBranch}
              setShipmentTools={setShipmentTools}
            />
            <SummaryTools
              tools={shipmentTools}
              handleRemoveShipmentTool={handleRemoveShipmentTool}
              handleRemoveComment={handleRemoveComment}
              handleSaveComment={handleSaveComment}
              handleSaveImages={handleSaveImages}
            />
            <ToolTransfer
              destinationBranchId={destinationBranch}
              sourceBranchId={selectedBranch?._id ?? ''}
              shipmentTools={shipmentTools}
              userId={user?._id ?? ''}
              setShipmentTools={setShipmentTools}
            />
          </div>
        </div>
      </TabsContent>
    </div>
  );
}

const ShipmentSkeleton = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="tool__skeleton" />
      </TableCell>
      <TableCell>
        <Skeleton className="tool__skeleton" />
      </TableCell>
      <TableCell>
        <Skeleton className="tool__skeleton" />
      </TableCell>
      <TableCell>
        <Skeleton className="tool__skeleton" />
      </TableCell>
      <TableCell>
        <Skeleton className="tool__skeleton" />
      </TableCell>
    </TableRow>
  );
};
