export type Decimal128 = { $numberDecimal: number };

export interface IProductoMasVendido {
  producto: string;
  cantidad: number;
  total: Decimal128;
  gananciaNeta: Decimal128;
  costoUnitario: Decimal128;
}

export interface IProductoConMasTotalVendidoDelDia {
  producto: string;
  cantidad: number;
  total: Decimal128;
  gananciaNeta: Decimal128;
  costoUnitario: Decimal128;
}

export interface IProductoConMasGananciaNetaDelDia {
  producto: string;
  cantidad: number;
  total: Decimal128;
  gananciaNeta: Decimal128;
  costoUnitario: Decimal128;
}

export interface IProductosMetrics {
  nombre: string;
  cantidad: number;
  total: Decimal128;
  totalCosto: Decimal128;
  gananciaNeta: Decimal128;
  costoUnitario: Decimal128;
  precio: Decimal128;
}

export interface IResponseGetProductMetrics {
  venta: {
    productoMayorCantidad: IProductoMasVendido;
    productoMayorTotal: IProductoConMasTotalVendidoDelDia;
    productoMayorGanancia: IProductoConMasGananciaNetaDelDia;
    listaProductos: IProductosMetrics[];
  };
  compra: {
    productoMayorCantidad: IProductoMasVendido;
    productoMayorTotal: IProductoConMasTotalVendidoDelDia;
    productoMayorGanancia: IProductoConMasGananciaNetaDelDia;
    listaProductos: IProductosMetrics[];
  };
  totalBuyBranch: Decimal128;
  totalBuyProfitBranch: Decimal128;
  totalSaleProfitBranch: Decimal128;
  totalSalesBranch: Decimal128;
}

export interface IReturnedProduct {
  productoId: string;
  nombre: string;
  cantidad: number;
  total: Decimal128;
  costoUnitario: Decimal128;
  gananciaNeta: Decimal128;
}

export interface IResponseGetReturnMetrics {
  VENTA: {
    amountReturned: Decimal128;
    quantityReturned: number;
    listProduct: IReturnedProduct[];
  };
  COMPRA: {
    amountReturned: Decimal128;
    quantityReturned: number;
    listProduct: IReturnedProduct[];
  };
}
