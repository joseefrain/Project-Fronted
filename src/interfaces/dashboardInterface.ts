export type Decimal128 = { $numberDecimal: number };

export interface IProductoMasVendido {
  producto: string;
  cantidad: number;
  total: Decimal128;
  gananciaNeta: Decimal128;
  costoUnitario: Decimal128;
}

export interface productoConMasTotalVenidioDelDia {
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

export interface IProductoMetrics {
  nombre: string;
  cantidad: number;
  total: Decimal128;
  gananciaNeta: Decimal128;
  costoUnitario: Decimal128;
}

export interface IResponseGetProductMetrics {
  productoMasVendido: IProductoMasVendido;
  productoConMasTotalVenidioDelDia: productoConMasTotalVenidioDelDia;
  productoConMasGananciaNetaDelDia: IProductoConMasGananciaNetaDelDia;
  productos: IProductoMetrics[];
}
