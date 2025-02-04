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
  gananciaNeta: Decimal128;
  costoUnitario: Decimal128;
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
}
